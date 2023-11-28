const { notifications,} = require('../models');

module.exports = {
  getUserNotifications: async (req, res) => {
    const userId = req.params.userId;

    try {
      const userNotifications = await notifications.findMany({
        where: {
          userId: parseInt(userId),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      await Promise.all(
        userNotifications.map(async (notification) => {
          await prisma.notifications.update({
            where: {
              id: notification.id,
            },
            data: {
              isRead: true,
            },
          });
        })
      );
      return res.status(200).json({
        notifications: userNotifications,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: 'Internal server error',
      });
    }
  },
};
