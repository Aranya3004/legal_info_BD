const pool = require('../config/db');     // Database connection
const bcrypt = require('bcryptjs');       // Password hashing
const jwt = require('jsonwebtoken');      // Token creation
require('dotenv').config();

// ============================================
// CONTROLLER 1: Register
// Handles: POST /api/auth/register
// What it does: Creates a new user account
// ============================================
const register = async (req, res) => {
  try {
    // Destructure the data sent from the frontend's registration form
    const { email, password, full_name, role, bar_number, specialization, department } = req.body;

    // --- VALIDATION ---
    // Check that all required fields are present
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ 
        error: 'Email, password, full name, and role are required.' 
      });
    }

    // Enforce that role must be exactly 'lawyer' or 'worker'
    if (!['lawyer', 'worker'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role must be either "lawyer" or "worker".' 
      });
    }

    // Enforce minimum password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters.' 
      });
    }

    // --- CHECK FOR DUPLICATE EMAIL ---
    // Query the database to see if this email is already registered
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()] // Always store emails in lowercase
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'An account with this email already exists.' 
      });
    }

    // --- HASH THE PASSWORD ---
    // bcrypt.hash() scrambles the password. 
    // The '10' is the "salt rounds" — higher = more secure but slower.
    // 10 is the industry standard balance.
    const password_hash = await bcrypt.hash(password, 10);

    // --- INSERT INTO DATABASE ---
    // We use a transaction so that if EITHER insert fails,
    // BOTH are rolled back. No half-created users.
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN'); // Start transaction

      // Insert into the main 'users' table
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, full_name) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, role, full_name, created_at`,
        [email.toLowerCase(), password_hash, role, full_name]
      );

      const newUser = userResult.rows[0];

      // Insert into the role-specific table (lawyers or workers)
      if (role === 'lawyer') {
        await client.query(
          `INSERT INTO lawyers (user_id, bar_number, specialization) 
           VALUES ($1, $2, $3)`,
          [newUser.id, bar_number || null, specialization || null]
        );
      } else if (role === 'worker') {
        await client.query(
          `INSERT INTO workers (user_id, department) 
           VALUES ($1, $2)`,
          [newUser.id, department || null]
        );
      }

      await client.query('COMMIT'); // Save everything if no errors

      // --- CREATE JWT TOKEN ---
      // This token is what the user will send with every future request
      // to prove they're logged in. It contains their id, email, and role.
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Send success response (don't send the password hash!)
      return res.status(201).json({
        message: 'Account created successfully!',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
        }
      });

    } catch (innerError) {
      await client.query('ROLLBACK'); // Undo everything if something failed
      throw innerError;
    } finally {
      client.release(); // Always return client to pool
    }

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ 
      error: 'Server error during registration. Please try again.' 
    });
  }
};

// ============================================
// CONTROLLER 2: Login
// Handles: POST /api/auth/login
// What it does: Verifies credentials, returns a token
// ============================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find the user by email in the database
    const result = await pool.query(
      'SELECT id, email, password_hash, role, full_name, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // If no user found with that email
    if (result.rows.length === 0) {
      // We say "invalid credentials" (not "email not found")
      // This is a security best practice — don't reveal which part is wrong
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    const user = result.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'Your account has been deactivated. Contact an administrator.' 
      });
    }

    // Compare the provided password with the stored hash
    // bcrypt.compare() handles this securely
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Create a new JWT token for this session
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return the token and safe user info (no password hash!)
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ 
      error: 'Server error during login. Please try again.' 
    });
  }
};

// ============================================
// CONTROLLER 3: Get My Profile
// Handles: GET /api/auth/me
// Protected route — requires a valid token
// ============================================
const getMe = async (req, res) => {
  try {
    // req.user.id was set by the verifyToken middleware
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ user: result.rows[0] });

  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { register, login, getMe };