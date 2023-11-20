const { users } = require("../models"),
  utils = require("../utils/index"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secrest";
module.exports = {
  register: async (req, res) => {
    try {
      const data = await users.create({
        data: {
          email: req.body.email,
          phone: req.body.phone,
          password: await utils.cryptPassword(req.body.password),
          isActive: true,
        },
      });
      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (!findUser) {
        return res.status(404).json({
          error: "Your email is not registered in our system",
        });
      }

      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign(
          { id: findUser.email, email: findUser.phone },
          secret_key,
          { expiresIn: "6h" }
        );

        return res.status(200).json({
          data: {
            token,
          },
        });
      }
      return res.status(403).json({
        error: "Invalid Credentials",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
    } catch (error) {}
  },
};
