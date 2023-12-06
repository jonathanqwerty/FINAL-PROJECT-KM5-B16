const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

const TokenFlex = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.user = null;
    next();
  }else{
    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice("bearer".length).trim();
    }
  
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired" });
        } else {
          return res.status(500).json({ message: "unauthenticated" });
        }
      }
  
      // Jika token valid, simpan informasi pengguna di objek req.user
      req.user = decoded;
      next();
    });
  }
  next();
};

module.exports = TokenFlex;
