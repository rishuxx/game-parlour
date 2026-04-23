import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ override: true });

async function seedDatabase() {
  console.log('🌱 Starting Database Seeding Process...');
  console.log(`Host: ${process.env.DB_HOST}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to Railway MySQL database successfully!');

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database_schema.sql');
    let sqlString = fs.readFileSync(schemaPath, 'utf8');

    // 1. Remove CREATE DATABASE and USE statements (Railway doesn't allow changing DBs)
    sqlString = sqlString.replace(/CREATE DATABASE IF NOT EXISTS gaming_parlour;/g, '');
    sqlString = sqlString.replace(/USE gaming_parlour;/g, '');

    // 2. We need to manually split the SQL because of the DELIMITER commands which `mysql2` does not understand natively.
    // We will extract the Procedure and Trigger separately, and run the rest as multipleStatements.

    console.log('📦 Executing Table/View/Data creation...');
    // We'll strip out everything from the first DELIMITER // to the end to get just tables/views/inserts
    const basicSqlParts = sqlString.split(/DELIMITER \/\//);
    const basicSql = basicSqlParts[0];
    
    // Run all the basic tables, views, and inserts
    await connection.query(basicSql);
    console.log('✅ Tables, Views, and Sample Data inserted.');

    // Now let's extract and run the Procedure:
    console.log('🔨 Creating Stored Procedure...');
    await connection.query(`DROP PROCEDURE IF EXISTS sp_start_booking;`);
    const procedureSql = `
      CREATE PROCEDURE sp_start_booking (
          IN p_customer_id INT,
          IN p_console_id INT
      )
      BEGIN
          DECLARE v_status VARCHAR(20);
          
          -- Check if console is available
          SELECT status INTO v_status FROM consoles WHERE console_id = p_console_id;
          
          IF v_status = 'Available' THEN
              -- Insert new booking
              INSERT INTO bookings (customer_id, console_id, start_time, status)
              VALUES (p_customer_id, p_console_id, NOW(), 'Active');
              
              -- Mark console as 'In Use'
              UPDATE consoles SET status = 'In Use' WHERE console_id = p_console_id;
          ELSE
              -- Throw an error if someone tries to book an already active console
              SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'Console is currently not available!';
          END IF;
      END
    `;
    await connection.query(procedureSql);
    console.log('✅ Stored Procedure created.');

    // Now let's extract and run the Trigger:
    console.log('⚡ Creating Trigger...');
    await connection.query(`DROP TRIGGER IF EXISTS after_booking_completed;`);
    const triggerSql = `
      CREATE TRIGGER after_booking_completed
      AFTER UPDATE ON bookings
      FOR EACH ROW
      BEGIN
          DECLARE hours_played DECIMAL(10,4);
          DECLARE rate DECIMAL(10,2);
          DECLARE total DECIMAL(10,2);
          
          -- Check if the booking was just marked as 'Completed'
          IF NEW.status = 'Completed' AND OLD.status != 'Completed' AND NEW.end_time IS NOT NULL THEN
              
              -- Calculate how many hours they played (minutes / 60)
              SET hours_played = TIMESTAMPDIFF(MINUTE, NEW.start_time, NEW.end_time) / 60.0;
              
              -- Minimum charge is for 0.5 hours (30 mins)
              IF hours_played < 0.5 THEN
                  SET hours_played = 0.5; 
              END IF;
              
              -- Fetch hourly rate from the console they used
              SELECT hourly_rate INTO rate FROM consoles WHERE console_id = NEW.console_id;
              
              -- Calculate final total amount
              SET total = ROUND(hours_played * rate, 2);
              
              -- Insert the automatically generated bill into the payments table
              INSERT INTO payments (booking_id, amount, payment_status, payment_date)
              VALUES (NEW.booking_id, total, 'Pending', NOW());
              
              -- Automatically free up the console for the next customer
              UPDATE consoles SET status = 'Available' WHERE console_id = NEW.console_id;
              
          END IF;
      END
    `;
    await connection.query(triggerSql);
    console.log('✅ Trigger created.');

    await connection.end();
    console.log('🎉 Database seeding completed successfully! All objects deployed.');

  } catch (error: any) {
    console.error('\n❌ Error during seeding:');
    console.error(error.message);
  }
}

seedDatabase();
