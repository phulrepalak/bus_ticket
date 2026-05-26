export const isAdmin = (req, res, next) => {
  // req.user has been set by authMiddleware after verifying the JWT token
  if (req.user && req.user.role === "admin") {
    next(); // Permission granted
  } else {
    res.status(403).json({ message: "Access Denied: Admins Only!" });
  }
};