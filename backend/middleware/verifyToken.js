import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error("🔸 Missing Authorization Header");
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Token Received:", token);

  if (!token) {
    console.error("🔸 Token missing after splitting Authorization header");
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Decoded Token Payload:", decoded);

    if (!decoded) {
      console.error("🔸 Token verification failed");
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized - Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("🔸 Token verification error:", error);
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }
};
