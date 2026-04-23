CREATE DATABASE IF NOT EXISTS gaming_parlour;
USE gaming_parlour;

-- ============================================================================
-- 1. TABLES (Normalized to 3NF)
-- ============================================================================

-- Customers Table
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consoles / Systems Table
CREATE TABLE consoles (
    console_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'PS5', 'Xbox', 'PC'
    hourly_rate DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'In Use', 'Maintenance') DEFAULT 'Available'
);

-- Games Table
CREATE TABLE games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    release_year INT
);

-- Console_Games (Many-to-Many Relationship joining Consoles and Games)
CREATE TABLE console_games (
    console_id INT,
    game_id INT,
    PRIMARY KEY (console_id, game_id),
    FOREIGN KEY (console_id) REFERENCES consoles(console_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Bookings Table (Records who is playing on what console)
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    console_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    -- Foreign Keys ensure relational integrity
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (console_id) REFERENCES consoles(console_id) ON DELETE RESTRICT
);

-- Payments Table (Stores billing generated from bookings)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT UNIQUE, -- 1-to-1 relationship with booking
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Pending', 'Paid') DEFAULT 'Pending',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. VIEWS (Virtual Tables for specific queries)
-- ============================================================================

-- View: Active Sessions
-- Combines Bookings, Customers, and Consoles to show who is currently playing
CREATE VIEW vw_active_sessions AS
SELECT 
    b.booking_id,
    c.name AS customer_name,
    c.phone,
    cs.name AS console_name,
    b.start_time,
    TIMESTAMPDIFF(MINUTE, b.start_time, NOW()) AS duration_minutes,
    cs.hourly_rate
FROM bookings b
JOIN customers c ON b.customer_id = c.customer_id
JOIN consoles cs ON b.console_id = cs.console_id
WHERE b.status = 'Active';

-- View: Total Billing Report
-- Uses JOINS to provide a comprehensive view of all bills and customer info
CREATE VIEW vw_billing_report AS
SELECT 
    p.payment_id,
    b.booking_id,
    c.name AS customer_name,
    cs.name AS console_name,
    b.start_time,
    b.end_time,
    p.amount,
    p.payment_status,
    p.payment_date
FROM payments p
JOIN bookings b ON p.booking_id = b.booking_id
JOIN customers c ON b.customer_id = c.customer_id
JOIN consoles cs ON b.console_id = cs.console_id;


-- ============================================================================
-- 3. STORED PROCEDURES
-- ============================================================================

-- Stored Procedure to safely start a booking, locking the console
DELIMITER //
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
END //
DELIMITER ;


-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- Trigger: Automatically calculate payment when a booking is Completed
-- It runs AFTER the 'bookings' table is updated.
DELIMITER //
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
END //
DELIMITER ;


-- ============================================================================
-- 5. SAMPLE DATA (DUMMY DATA FOR TESTING)
-- ============================================================================

INSERT INTO customers (name, phone, email) VALUES
('Rahul Sharma', '9876543210', 'rahul@example.com'),
('Priya Singh',  '9876543211', 'priya@example.com'),
('Amit Patel',   '9876543212', 'amit@example.com');

INSERT INTO consoles (name, type, hourly_rate, status) VALUES
('Station 1 - PS5',     'PS5',  150.00, 'Available'),
('Station 2 - PS5',     'PS5',  150.00, 'Available'),
('Station 3 - Xbox UI', 'Xbox', 120.00, 'Available'),
('Station 4 - High End PC', 'PC', 200.00, 'Available');

INSERT INTO games (title, genre, release_year) VALUES
('FIFA 24', 'Sports', 2023),
('GTA V', 'Action/Adventure', 2013),
('Valorant', 'FPS', 2020),
('God of War Ragnarok', 'Action', 2022);

-- Map Games to Consoles
INSERT INTO console_games (console_id, game_id) VALUES
(1, 1), (1, 2), (1, 4), -- PS5 games
(2, 1), (2, 2), (2, 4), -- PS5 games
(3, 1), (3, 2),         -- Xbox game
(4, 3), (4, 2);         -- PC games
