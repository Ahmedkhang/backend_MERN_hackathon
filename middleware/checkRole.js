// Role Check Middleware - Check if user has required role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied - Insufficient permissions' });
    }

    next();
  };
};

module.exports = checkRole;
