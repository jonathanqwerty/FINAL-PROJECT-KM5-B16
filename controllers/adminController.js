const validate = require("../middlewares/validate");
const { users, notifications, courses, orders, categories } = require("../models"),
  utils = require("../utils/index"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");

  require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secrest";

module.exports = {
    login: async (req, res) => {
      try {
        const findUser = await users.findFirst({
          where: {
            email: req.body.email,
          },
        });
  
        if (!findUser) {
          return res.status(403).json({
            error: "Your email is not registered in our system",
          });
        }
        if (findUser && findUser.isActive === false) {
            return res.status(403).json({
              message: "Please verify you account first",
            });
          }    
        if (findUser && findUser.role !== "admin") {
          return res.status(403).json({
            message: "You are not an admin to access this endpoint",
          });
        }
        if (bcrypt.compareSync(req.body.password, findUser.password)) {
            const token = jwt.sign(
                { id: findUser.id, email: findUser.email, phone: findUser.phone, role: findUser.role},
                  secret_key,
                { expiresIn: "6h" }
                );
        await notifications.create({
          data: {
            userId: findUser.id,
            message: "You have successfully logged in.",
          },
        });
          return res.status(200).json({
            data: {
              token,
            },
          });
        }
  
        return res.status(403).json({
          message: "Invalid Password",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error,
        });
      }
    },
    activeUser: async (req,res) => {
        try{
            const activeUser = await users.count({
                where: {
                    isActive: true
                },
            });
            return res.status(200).json({
                activeUser
            });
        } catch (error){
            console.log(error);
            return res.status(500).json({
              error,
            });
          }
        
    },
    activeClass: async (req,res) => {
        try{
            const activeClass = await courses.count({
                where: {
                    available: true
                },
            });
            return res.status(200).json({
                activeClass
            });
        } catch (error){
            console.log(error);
            return res.status(500).json({
              error,
            });
          }
        
    },
    activePremium: async (req,res) => {
        try{
            const activePremium = await courses.count({
                where: {
                    price: {
                            not : 0 
                      }
                    }
            });
            return res.status(200).json({
                activePremium
            });
        } catch (error){
            console.log(error);
            return res.status(500).json({
              error,
            });
          }
    },
  
    };      