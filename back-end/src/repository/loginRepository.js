// filepath: c:\Users\lucas\OneDrive\Área de Trabalho\TaskBuddy\back-end\src\repository\loginRepository.js
const User = require("../models/loginModels");

const createUser = async (email, senha) => {
  const user = new User({ email, senha });
  return await user.save();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  createUser,
  findUserByEmail,
};
