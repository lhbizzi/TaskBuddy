const userRepository = require("../repository/loginRepository");
const jwt = require("jsonwebtoken");

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: "O email e a senha são obrigatórios.",
      });
    }

    const user = await userRepository.findUserByEmail(email);
    if (user && user.senha === senha) {
      // Gerar token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        success: true,
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user._id,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email
        },
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
    // Gerar token JWT após registro
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      success: true,
      message: "Usuário registrado com sucesso!",
      token,
      user: {
        id: user._id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email
      },
    });
  }

  async getAllUsers(req, res) {
    const users = await userRepository.getAllUsers();
    return res.json(users);
  }

  async getUserById(req, res) {
    const { id } = req.params;
    const user = await userRepository.getUserById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuário não encontrado." });
    }
    return res.json(user);
  }
}

module.exports = AuthController;
