const { users, profiles } = require("../models"),
  jwt = require("jsonwebtoken");

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
      if (jwt.TokenExpiredError) {
        return res.status(400).json({
          message: "Your session has ended, please login again",
        });
      }
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
    const profileUpdate = await users.findUnique({
      where: {
        email: res.user.email,
      },
    });

    return res.status(200).json({
      data: profileUpdate,
      message: "success update your profile",
    });
  },
};
