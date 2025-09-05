// Regras de negócio para tarefas
const TaskRepository = require("../repository/taskRepository");

const TaskService = {
  getAllTasks: async () => await TaskRepository.getAll(),
  getTaskById: async (id) => await TaskRepository.getById(id),
  getTasksByUserId: async (userId) => await TaskRepository.getByUserId(userId),
  getTasksByDueDate: async (dueDate) =>
    await TaskRepository.getByDueDate(dueDate),
  getTasksByCreatedAt: async (createdAt) =>
    await TaskRepository.getByCreatedAt(createdAt),
  createTask: async (task) => await TaskRepository.create(task),
  updateTask: async (id, task) => await TaskRepository.update(id, task),
  deleteTask: async (id) => await TaskRepository.delete(id),
};

module.exports = TaskService;
