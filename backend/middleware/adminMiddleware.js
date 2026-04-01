export const isAdmin = (req, res, next) => {
  // req.user humein authMiddleware se milta hai jo token ko decode karta hai
  if (req.user && req.user.role === "admin") {
    next(); // Permission granted
  } else {
    res.status(403).json({ message: "Access Denied: Admins Only!" });
  }
};