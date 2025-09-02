// filepath: c:\Users\lucas\OneDrive\Área de Trabalho\TaskBuddy\back-end\src\repository\loginRepository.js
const User = require("../models/loginModels");

// Salvar novo usuário
async function createUser(nome, sobrenome, email, senha) {
  const user = new User({ nome, sobrenome, email, senha });
  return await user.save();
}
// Buscar usuário por email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Buscar todos os usuários
const getAllUsers = async () => {
  return await User.find();
};

// Buscar usuário por ID
const getUserById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
};
