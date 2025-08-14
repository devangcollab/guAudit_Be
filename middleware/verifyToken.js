const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const jwtToken = token.split(" ")[1];
    const decoded = JWT.verify(jwtToken, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth User Middleware error" , error });
  }
};

module.exports = verifyToken;
