const jwt = require('jsonwebtoken');
const { User } = require('../models/User'); // Assuming you have a User model
const jwtSecret = process.env.JWT_SECRET || 'your3_jwt_secret';
const authenticateUser = async (req, res, next) => {
    const token = req.header('x-auth-token');
  
    if (!token) {
      return res.status(401).json({ error: 'Authorization denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.decode(token); // Using jwt.verify to validate the token
      console.log('Token verification pass:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ error: 'Token is not valid.' });
    }
  };

module.exports = { authenticateUser };