const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * 🔒 Protect Routes
 * Verifies the JWT token and attaches the user to the request object.
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header (Format: "Bearer <token>")
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer does exist."
      });
    }

    // 4. Attach user to the request object
    // Now any route after this can use 'req.user' to know who is logged in!
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * ⛔ Restrict To Specific Roles
 * Example: router.delete('/delete-user', protect, restrictTo('admin'), deleteUser);
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set in the 'protect' middleware above
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};