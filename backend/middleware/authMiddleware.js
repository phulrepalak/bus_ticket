import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Header se token nikaalein
  const token = req.header("Authorization");

  // 2. Check karein agar token nahi hai
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // 3. Agar token "Bearer <token>" format mein hai, toh use clean karein
    const cleanToken = token.replace("Bearer ", "");

    // 4. Token verify karein
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // 5. User data ko request object mein daalein taaki controllers ise use kar sakein
    req.user = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;