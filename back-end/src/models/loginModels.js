// filepath: c:\Users\lucas\OneDrive\Área de Trabalho\TaskBuddy\back-end\src\models\User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
