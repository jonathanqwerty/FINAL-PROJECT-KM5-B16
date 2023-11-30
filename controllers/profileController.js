const { users, profiles } = require("../models"),
  jwt = require("jsonwebtoken"),
  utils = require("../utils/index");

module.exports = {
  profile: async (req, res) => {
    try {
      const user = await users.findUnique({
        include: {
          profiles: true,
        },
        where: {
          email: res.user.email,
        },
      });
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
  profileUpdate: async (req, res) => {
    try {
      const user = await users.findUnique({
        where: {
          email: res.user.email,
        },
        include: {
          profiles: true,
        },
      });

      const profileUpdate = await profiles.update({
        where: {
          id: user.profiles.id,
        },
        data,
      });

      return res.status(200).json({
        profileUpdate,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },
};
