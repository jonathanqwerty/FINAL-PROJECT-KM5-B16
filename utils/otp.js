const otpGenerator = require("otp-generator");
module.exports = {
  otp: otpGenerator.generate({
    OTP_LENGTH: 6,
    OTP_CONFIG: {
      upperCaseAlphabets: false,
      specialChars: false,
    },
  }),
};
