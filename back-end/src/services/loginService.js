const userRepository = require("../repository/loginRepository");

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "O email é obrigatório." });
    }
    if (!senha) {
      return res
        .status(400)
        .json({ success: false, message: "A senha é obrigatória." });
    }
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
    const { nome, sobrenome, email, senha } = req.body;
    if (!nome) {
      return res
        .status(400)
        .json({ success: false, message: "O nome é obrigatório." });
    }
    if (!sobrenome) {
      return res
        .status(400)
        .json({ success: false, message: "O sobrenome é obrigatório." });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "O email é obrigatório." });
    }
    if (!senha) {
      return res
        .status(400)
        .json({ success: false, message: "A senha é obrigatória." });
    }
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado." });
    }
    const user = await userRepository.createUser(nome, sobrenome, email, senha);
    return res.json({
      success: true,
      message: "Usuário registrado com sucesso!",
      user: { nome: user.nome, sobrenome: user.sobrenome, email: user.email },
    });
  }
}

module.exports = AuthController;
