const Advice = require("../models/adviceModel");

const AdviceRepository = {
  async createOrUpdateAdvice({ userId, taskId, steps }) {
    // Se já existe advice para userId+taskId, faz update, senão cria
    return await Advice.findOneAndUpdate(
      { userId, taskId },
      { steps, updatedAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
  async deleteAdviceByUserAndTask(userId, taskId) {
    return await Advice.deleteOne({ userId, taskId });
  },
  async getAdviceByUserAndTask(userId, taskId) {
    return await Advice.findOne({ userId, taskId });
  },
};

module.exports = AdviceRepository;
