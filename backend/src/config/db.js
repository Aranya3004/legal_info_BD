// We import the 'pg' library we installed.
// 'Pool' means we maintain a pool of reusable connections
// instead of opening a new one for every query (much faster).
const { Pool } = require('pg');

// dotenv reads our .env file and makes those values
// available via process.env.VARIABLE_NAME
require('dotenv').config();

// Create the connection pool using values from .env
const pool = new Pool({
  host: process.env.DB_HOST,         // 'localhost'
  port: process.env.DB_PORT,         // 5432
  database: process.env.DB_NAME,     // 'legal_ai_db'
  user: process.env.DB_USER,         // 'postgres'
  password: process.env.DB_PASSWORD, // your password
});

// Test the connection when the server starts.
// pool.connect() attempts to open a connection.
pool.connect((err, client, release) => {
  if (err) {
    // If there's an error (wrong password, DB not running, etc.)
    // we log it clearly so you know exactly what went wrong.
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
    release(); // Release the test connection back to the pool
  }
});

// Export the pool so any other file can use it to run queries
module.exports = pool;