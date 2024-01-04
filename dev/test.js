const { Prisma } = require("@prisma/client");
const { categories, reviews, courses, myCourse, orders,  progres, chapters,sources, goals, users} = require("../models");
const {Course} = require('../utils/course');
const { promises } = require("nodemailer/lib/xoauth2");
const utils = require("../utils");


 async function FilterCourse(){
  try {
    //mencari data cource
    const course = await courses.findFirst({
      where : {id: 3},
      select : {
        chapters : {
          select :{
            id : true,
          title : true,
          duration: true,
            sources : true
          }
        }
      }
    })
    const idChapter = course.chapters.map(item=>(item.id))
    console.log(idChapter)
    const a = [22,23,24]
    let Data = await Promise.all(
      course.chapters.map(async (item) => {
        const source = await Promise.all(
          item.sources.map(async (item2)=>{
            if(a.some(value => value === item2.id)){
              return {
                ...item2,
                read : true
              }
            }else{
              return {
                read : false,
                ...item2,
              }
            }
          }))
        return{
          id : item.id,
          tittle : item.title,
          duration :item.duration,
          sources : source
        }
      }))
    console.log(JSON.stringify(Data))
  } catch (error) {
    console.log(error);
  }
};
// const i = 'j'
// const tes = parseInt(i)
// isNaN(tes) ? console.log('is NaN') : console.log('ppp')
// console.log(tes)
FilterCourse()
