import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // token is taken from the Authorization header in the format
  const token = req.header("Authorization");

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // 3. clean the token by removing "Bearer " prefix if it exists
    const cleanToken = token.replace("Bearer ", "");

    // 4. Token verify 
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // 5. User data attach  (id and role) for use in controllers
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;