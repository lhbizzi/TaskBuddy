const userRepository = require("../repository/loginRepository");

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;
    const user = await userRepository.findUserByEmail(email);
    if (user && user.senha === senha) {
      return res.json({
        success: true,
        message: "Login realizado com sucesso!",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Credenciais inválidas." });
  }

  async register(req, res) {
    const { email, senha } = req.body;
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado." });
    }
    const user = await userRepository.createUser(email, senha);
    return res.json({
      success: true,
      message: "Usuário registrado com sucesso!",
      user: { email: user.email },
    });
  }
}

module.exports = AuthController;
