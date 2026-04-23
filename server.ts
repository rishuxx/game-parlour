import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ override: true });

// Initialize the Express App
const app = express();
const PORT = 3000;

app.use(express.json());

// Global DB Connection Pool
let pool: mysql.Pool | null = null;
let dbError: string | null = null;
let dbConnected = false;
let dbInitComplete = false;

// Attempt to connect to the MySQL database
async function initDB() {
  try {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gaming_parlour',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    pool = mysql.createPool(dbConfig);
    
    // Test the connection (fails fast if no DB is available)
    const connection = await pool.getConnection();
    console.log(`✅ Successfully connected to MySQL database: ${dbConfig.database}`);
    connection.release();
    dbConnected = true;
    dbError = null;
  } catch (error: any) {
    console.error('❌ MySQL Connection Failed: ', error.message);
    dbError = error.message;
    pool = null;
    dbConnected = false;
  } finally {
    dbInitComplete = true;
  }
}

initDB();

// ---------------------------------------------------------
// REST APIs for DBMS Operations
// ---------------------------------------------------------

// Middleware to check DB status
const requireDB = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!dbConnected || !pool) {
     res.status(503).json({ error: 'Database is not connected', details: dbError });
     return;
  }
  next();
};

// 1. Check DB Connection Status (Used by UI to show setup screen)
app.get('/api/status', (req, res) => {
  // If still initializing, wait briefly or just return false
  if (!dbInitComplete) {
    res.json({ connected: false, error: 'Database initializing...' });
    return;
  }
  if (dbConnected) {
    res.json({ connected: true });
  } else {
    res.json({ connected: false, error: dbError });
  }
});

// 2. Customers API (CRUD)
app.get('/api/customers', requireDB, async (req, res) => {
  try {
    const [rows] = await pool!.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', requireDB, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const [result] = await pool!.query(
      'INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)',
      [name, phone, email]
    );
    res.json({ message: 'Customer added successfully', id: (result as any).insertId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', requireDB, async (req, res) => {
  try {
    await pool!.query('DELETE FROM customers WHERE customer_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      res.status(400).json({ error: 'Cannot delete customer. They have existing bookings in the system.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// 3. Consoles API
app.get('/api/consoles', requireDB, async (req, res) => {
  try {
    const [rows] = await pool!.query('SELECT * FROM consoles');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/consoles', requireDB, async (req, res) => {
  try {
    const { name, type, hourly_rate } = req.body;
    await pool!.query('INSERT INTO consoles (name, type, hourly_rate) VALUES (?, ?, ?)', [name, type, hourly_rate]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/consoles/:id/status', requireDB, async (req, res) => {
  try {
    const { status } = req.body;
    await pool!.query('UPDATE consoles SET status = ? WHERE console_id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/consoles/:id', requireDB, async (req, res) => {
  try {
    await pool!.query('DELETE FROM consoles WHERE console_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Console Mapping APIs
app.get('/api/consoles/:id/games', requireDB, async (req, res) => {
  try {
    const [rows] = await pool!.query('SELECT g.* FROM games g JOIN console_games cg ON g.game_id = cg.game_id WHERE cg.console_id = ?', [req.params.id]);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/consoles/:id/games', requireDB, async (req, res) => {
  try {
    const { game_id } = req.body;
    await pool!.query('INSERT INTO console_games (console_id, game_id) VALUES (?, ?)', [req.params.id, game_id]);
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Game is already mapped to this console' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/consoles/:id/games/:gameId', requireDB, async (req, res) => {
  try {
    await pool!.query('DELETE FROM console_games WHERE console_id = ? AND game_id = ?', [req.params.id, req.params.gameId]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3.5. Games API
app.get('/api/games', requireDB, async (req, res) => {
  try {
    const [rows] = await pool!.query('SELECT * FROM games ORDER BY title ASC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/games', requireDB, async (req, res) => {
  try {
    const { title, genre, release_year } = req.body;
    await pool!.query('INSERT INTO games (title, genre, release_year) VALUES (?, ?, ?)', [title, genre, release_year]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/games/:id', requireDB, async (req, res) => {
  try {
    await pool!.query('DELETE FROM games WHERE game_id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Bookings API
// Get active sessions using the VIEW we created in the schema
app.get('/api/active-sessions', requireDB, async (req, res) => {
  try {
    const [rows] = await pool!.query('SELECT * FROM vw_active_sessions');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get previously completed sessions
app.get('/api/previous-sessions', requireDB, async (req, res) => {
  try {
    const query = `
      SELECT 
        b.booking_id, 
        c.name as customer_name, 
        con.name as console_name, 
        b.start_time, 
        b.end_time, 
        TIMESTAMPDIFF(MINUTE, b.start_time, b.end_time) as duration_mins
      FROM bookings b
      JOIN customers c ON b.customer_id = c.customer_id
      JOIN consoles con ON b.console_id = con.console_id
      WHERE b.status = 'Completed'
      ORDER BY b.end_time DESC
      LIMIT 20
    `;
    const [rows] = await pool!.query(query);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Start a booking using the Stored Procedure
app.post('/api/bookings/start', requireDB, async (req, res) => {
  try {
    const { customer_id, console_id } = req.body;
    await pool!.query('CALL sp_start_booking(?, ?)', [customer_id, console_id]);
    res.json({ message: 'Booking started successfully' });
  } catch (err: any) {
    // 45000 is our custom error state from the stored procedure
    res.status(500).json({ error: err.message });
  }
});

// End a booking - this triggers the Payment generation!
app.post('/api/bookings/end/:id', requireDB, async (req, res) => {
  try {
    const bookingId = req.params.id;
    // Updating status to Completed will fire our DB Trigger
    await pool!.query(
      'UPDATE bookings SET status = ?, end_time = NOW() WHERE booking_id = ?',
      ['Completed', bookingId]
    );
    res.json({ message: 'Booking completed. Payment generated automatically.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Billing / Payments API
// Get total billing report manually to include payment_method
app.get('/api/billing', requireDB, async (req, res) => {
  try {
    const query = `
      SELECT 
          p.payment_id,
          b.booking_id,
          c.name AS customer_name,
          cs.name AS console_name,
          b.start_time,
          b.end_time,
          p.amount,
          p.payment_status,
          p.payment_method,
          p.payment_date
      FROM payments p
      JOIN bookings b ON p.booking_id = b.booking_id
      JOIN customers c ON b.customer_id = c.customer_id
      JOIN consoles cs ON b.console_id = cs.console_id
      ORDER BY p.payment_date DESC
    `;
    const [rows] = await pool!.query(query);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/pay/:id', requireDB, async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { method } = req.body; // e.g., 'Cash', 'Card', 'UPI'
    await pool!.query(
      'UPDATE payments SET payment_status = ?, payment_method = ? WHERE payment_id = ?',
      ['Paid', method || 'Cash', paymentId]
    );
    res.json({ message: 'Payment marked as Paid successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// Vite Middleware for Frontend Serving
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
