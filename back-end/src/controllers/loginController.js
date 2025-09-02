const AuthController = require("../services/loginService");
const authController = new AuthController();

module.exports = {
  login: (req, res) => authController.login(req, res),
  register: (req, res) => authController.register(req, res),
};
