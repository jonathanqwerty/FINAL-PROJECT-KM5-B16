const otp = require("otp-generator");
const models = require("../models");

module.exports = {
  generateOTP: function () {
    return otp.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  },
};
