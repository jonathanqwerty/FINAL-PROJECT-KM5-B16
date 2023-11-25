const otp = require("otp-generator");

module.exports = {
  generateOTP: function () {
    return otp.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  },
};
