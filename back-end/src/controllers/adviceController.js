const AdviceService = require("../services/adviceService");

const AdviceController = {
  async save(req, res) {
    try {
      const { taskId, steps } = req.body;
      const userId = req.user.id;
      if (!taskId || !steps || typeof steps !== "object") {
        return res
          .status(400)
          .json({ message: "taskId e steps (objeto) são obrigatórios." });
      }
      const advice = await AdviceService.saveAdvice({ userId, taskId, steps });
      res.status(201).json(advice);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao salvar advice", error: err.message });
    }
  },
  async getByUserAndTask(req, res) {
    try {
      const userId = req.user.id;
      const { taskId } = req.params;
      if (!taskId)
        return res.status(400).json({ message: "taskId é obrigatório." });
      const advice = await AdviceService.getAdviceByUserAndTask(userId, taskId);
      // Se não houver advice no banco, retornar 200 com valor null
      if (!advice) return res.status(200).json(null);
      return res.status(200).json(advice);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao buscar advice", error: err.message });
    }
  },
};

module.exports = AdviceController;
