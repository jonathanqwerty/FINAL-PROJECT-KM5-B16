const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

const adminToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: "please provide a token",
    });
  }

  if (token.toLowerCase().startsWith("bearer")) {
    token = token.slice("bearer".length).trim();
  }

  try {
        const jwtPayload = jwt.verify(token, secret_key);
    if (!jwtPayload || jwtPayload.role !== 'admin') {
        return res.status(403).json({ 
        message: "Forbidden: Access denied for non-admin users" 
      });
    }
    req.user = jwtPayload; 
    next();
  } catch (error) {
        return res.status(401).json({
        error: "Invalid or expired token",
    });
  }
};

module.exports = adminToken;
