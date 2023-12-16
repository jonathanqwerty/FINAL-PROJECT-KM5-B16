const bcrypt = require("bcrypt");

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);

  return bcrypt.hash(password, salt);
};

const cryptToken = async (email) => {
  const salt = await bcrypt.genSalt(5);

  return bcrypt.hash(email, salt);
};

module.exports = {
  cryptPassword,
  cryptToken,
};
