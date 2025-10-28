const AdviceRepository = require("../repository/adviceRepository");

const AdviceService = {
  async saveAdvice({ userId, taskId, steps }) {
    // Se steps for um objeto vazio, exclui advice existente
    if (steps && typeof steps === "object" && Object.keys(steps).length === 0) {
      await AdviceRepository.deleteAdviceByUserAndTask(userId, taskId);
      return { deleted: true };
    }
    return await AdviceRepository.createOrUpdateAdvice({
      userId,
      taskId,
      steps,
    });
  },
  async getAdviceByUserAndTask(userId, taskId) {
    return await AdviceRepository.getAdviceByUserAndTask(userId, taskId);
  },
};

module.exports = AdviceService;
