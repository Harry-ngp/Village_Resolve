const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get token from header
  const token = req.header('Authorization');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify token (Remove "Bearer " if present)
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    // Make sure you have JWT_SECRET in your .env file!
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};