const { users, profiles, notifications } = require("../models");

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

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({
        error: "Internal Server Error",
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
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const updatedProfile = await profiles.update({
        where: {
          id: user.profiles.id, 
        },
        data: {
          image: req.body.image || user.profiles.image,
          country: req.body.country || user.profiles.country,
          city: req.body.city || user.profiles.city,
        },

      await notifications.create({
        data: {
          message: "Your profile has been updated successfully.",
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return res.status(200).json({
        success: true,
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  },
};