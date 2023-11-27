const validate = require("../middlewares/validate");
const { users } = require("../models"),
  utils = require("../utils/index"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  nodemailer = require("nodemailer"),
  otp = require("../utils/otp"),
  { google } = require("googleapis"),
  { Oauth2, authorizationUrl } = require("../utils/Oauth");

require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secrest";

module.exports = {
  register: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.body.email,
        },
      });
      if (findUser) {
        return res.status(403).json({
          error: "Your email already exist",
        });
      }
      const generateOTP = otp.generateOTP();
      const data = await users.create({
        data: {
          email: req.body.email,
          phone: req.body.phone,
          password: await utils.cryptPassword(req.body.password),
          validasi: generateOTP,
          isActive: false,
          profiles: {
            create: {
              name: req.body.name,
            },
          },
        },
      });

      const transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOption = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "OTP-VERIFICATION",
        html: `<div style="border: 1px solid #6148FF; border-radius: 10px; width: 45vw; flex-direction: column; padding: 2rem; background-color: #ffff; font-family:calibri; font-weight:600; font-size:18px;">
            <p>Hi ! ${req.body.email} <br/> We've received an OTP request from your ${req.body.name}. <br/> Please input the 6 digit code below to authenticate your account</p> <br/>
            <center><h1 style= " color: #6148FF; letter-spacing: .5rem; font-weight:900">${generateOTP}</h1> <br /></center>
            <p>If you didn't make this request, you may ignore this email, <br />email us at <q>nathanaeljonathan09@gmail.com</q> on Monday - Friday, 09.00 - 18.00 WIB | Saturday, 09.00 - 15.00 WIB </p>
        </div>`,
      };
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return res.status(403).json({
            error: "Your email is not registered in our system",
          });
        }
        console.log("Email sent: " + info.response);
      });
      return res.status(201).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Internal server error",
      });
    }
  },

  verifyUser: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          email: req.params.key,
        },
      });
      if (!findUser) {
        return res.status(403).json({
          error: "Your email is not registered in our system",
        });
      }
      console.log(findUser.validasi);
      if (findUser && findUser.validasi !== req.body.validasi) {
        return res.status(403).json({
          error: "Your OTP not valid",
        });
      }
      const data = await users.update({
        data: {
          isActive: true,
        },
        where: {
          id: findUser.id,
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
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
          error: "Please verify you account first",
        });
      }

      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign(
          { email: findUser.email, phone: findUser.phone },
          secret_key,
          { expiresIn: "6h" }
        );

        return res.status(200).json({
          data: {
            token,
          },
        });
      }
      return res.status(403).json({
        error: "Invalid Password",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  loginGoogle: (req, res) => {
    res.redirect(authorizationUrl);
  },
  callbackLogin: async (req, res) => {
    const { code } = req.query;
    const { tokens } = await Oauth2.getToken(code);
    Oauth2.setCredentials(tokens);

    console.log(code);

    const oauth2 = google.oauth2({
      auth: Oauth2,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    if (!data) {
      return res.json({
        data: data,
      });
    }

    let user = await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      user = await prisma.users.create({
        data: {
          username: data.name,
          email: data.email,
        },
      });
    }
    user = await prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    const token = jwt.sign({ id: user.id }, "secret_key", {
      expiresIn: "6h",
    });

    return res.status(200).json({
      data: {
        token,
      },
    });
  },

  resetPassword: async (req, res) => {
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

      const bcryptToken = await utils.cryptPassword(
        req.body.email.replace(/[\/\s]+/g, "@")
      );
      await users.update({
        data: {
          resetPasswordToken: bcryptToken,
        },
        where: {
          id: findUser.id,
        },
      });

      const transporter = nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetPasswordLink = `https://oneacademy-staging.pemudasukses.tech/forgot/${bcryptToken}`;
      const mailOption = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Reset-Password",
        html: `<div style="border: 1px solid #6148FF; border-radius: 10px; width: 45vw; flex-direction: column; padding: 2rem; background-color: #ffff; font-family:calibri; font-weight:600; font-size:18px;">
            <p>Hi ! ${req.body.email} <br/> We've received an Reset Password Request. <br/> click link below to reset your password</p> <br/>
            <center><a style="border: 1px solid transparant; border-radius: 10px; padding: 1rem; background-color: #00aeff; color:white; hover: cursor; text-decoration:none;" href="${resetPasswordLink}">Reset-Password</a></center><br/>
            <p>If you didn't make this request, you may ignore this email, <br />email us at <q>nathanaeljonathan09@gmail.com</q> on Monday - Friday, 09.00 - 18.00 WIB | Saturday, 09.00 - 15.00 WIB </p>
        </div>`,
      };
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          return res.status(403).json({
            error: "Your email is not registered in our system",
          });
        }
        console.log("Email sent: " + info.response);
      });
      return res.status(201).json({
        message: "The reset password link has been sent to your email",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },

  setPassword: async (req, res) => {
    try {
      const findUser = await users.findFirst({
        where: {
          resetPasswordToken: req.params.key,
        },
      });

      if (!findUser) {
        return res.status(403).json({
          error: "Your email is not registered in our system",
        });
      }

      console.log("Password from req.body:", req.body.password);
      const data = await users.update({
        where: {
          id: findUser.id,
        },
        data: {
          password: await utils.cryptPassword(req.body.password),
          resetPasswordToken: null,
        },
      });

      return res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error,
      });
    }
  },
};
