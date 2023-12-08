const {notifications} = require('../models')

module.exports={
    notif: async(userId, notification)=>{
        await notifications.create({
            data:{
                userId : userId,
                message : notification
            }
        })
        return notification
    }
}