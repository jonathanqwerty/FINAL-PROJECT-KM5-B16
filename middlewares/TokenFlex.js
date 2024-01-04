const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

const TokenFlex = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.user = null;
  }else{
    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice("bearer".length).trim();
    }
    jwt.verify(token, secret_key, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.user = null;
        } else {
          res.user = null;
        }
      }else{
        // Jika token valid, simpan informasi pengguna di objek req.user
        res.user = decoded;
    // console.log("token masuk")
      }
    });
  }
  next();
};

module.exports = TokenFlex;
