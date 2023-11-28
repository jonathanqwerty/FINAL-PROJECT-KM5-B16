const { users } = require("../models"),
  jwt = require("jsonwebtoken");

module.exports = {
  profile: async (res) => {
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
};
