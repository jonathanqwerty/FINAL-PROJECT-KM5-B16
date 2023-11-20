const { body } = require("express-validator");

const registerValidator = [
  body("email").notEmpty().isEmail(),
  body("phone").notEmpty().isMobilePhone(),
  body("password").notEmpty,
];

const loginValidator = [
  body("email").notEmpty().isEmail(),
  body("password").notEmpty(),
];

const changePasswordValidator = [
  body("old_password").notEmpty(),
  body("password").notEmpty(),
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
};
