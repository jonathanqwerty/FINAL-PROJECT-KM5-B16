const { users, profiles, notifications } = require("../models"),
  utils = require("../utils/index");
const { imageKit } = require("../utils/imageKit");

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
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const fileTostring = req.file.buffer.toString("base64");

      const uploadFile = await imageKit.upload({
        fileName: req.file.originalname,
        file: fileTostring,
      });

      const updatedProfile = await profiles.update({
        where: {
          id: user.profiles.id,
        },
        data: {
          name: req.body.name || user.profiles.name,
          image: uploadFile.url || user.profiles.image,
          country: req.body.country || user.profiles.country,
          city: req.body.city || user.profiles.city,
          users: {
            update: {
              where: {
                id: user.id,
              },
              data: {
                password:
                  (await utils.cryptPassword(req.body.password)) ||
                  user.password,
                phone: req.body.phone || user.phone,
              },
            },
          },
        },
        include: {
          users: true,
        },
      });

      if (!updatedProfile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

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
