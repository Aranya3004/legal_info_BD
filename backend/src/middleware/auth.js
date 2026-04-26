const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============================================
// MIDDLEWARE 1: verifyToken
// This function runs BEFORE your route handlers.
// It checks: "Does this request have a valid login token?"
// If yes → allow through. If no → reject with 401 Unauthorized.
// ============================================
const verifyToken = (req, res, next) => {
  // Tokens are sent in the request header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  const authHeader = req.headers['authorization'];

  // If no Authorization header exists at all, reject immediately
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  // The header looks like "Bearer <token>"
  // We split by space and take the second part (index 1)
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. Token format invalid.' 
    });
  }

  try {
    // jwt.verify() decodes the token using our secret key
    // If the token is fake or expired, it throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    // Now any route handler can access req.user to know WHO is calling
    req.user = decoded;

    // next() passes control to the next function in the chain
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired token. Please log in again.' 
    });
  }
};

// ============================================
// MIDDLEWARE 2: requireLawyer
// This runs AFTER verifyToken.
// It checks: "Is the logged-in user a lawyer?"
// Workers will be BLOCKED here — this is your role enforcement.
// ============================================
const requireLawyer = (req, res, next) => {
  // req.user was attached by verifyToken above
  if (req.user.role !== 'lawyer') {
    return res.status(403).json({ 
      // 403 = Forbidden (you're logged in, but not allowed)
      error: 'Access denied. This feature is for lawyers only.' 
    });
  }
  next(); // User is a lawyer — allow through
};

// Export both so routes can use them
module.exports = { verifyToken, requireLawyer };