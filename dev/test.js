const { Prisma } = require("@prisma/client");
const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources, goals, users} = require("../models");
const {Course} = require('../utils/course');
const { promises } = require("nodemailer/lib/xoauth2");

 async function FilterCourse(){
  try {
    id = parseInt(1)
    user = 1 || parseInt(res.user.id)

    const MyCourse = await myCourse.create({
      data:{
        user    : user,
        course  : id,
        order : 1,
        orders   : {
          create: {
            status: 'notPaid'
          }
        }
      }
    })

    //  const a ={
    //   modul,
    //   duration : `${duration._sum.duration} mnt`,
    //   rating : review._avg.rating,
    //   course
    //  }
     console.log(JSON.stringify(MyCourse,null,2))

  } catch (error) {
    console.log(error)
  }
};

FilterCourse()
