// Regras de negócio para tarefas
const TaskRepository = require("../repository/taskRepository");

const TaskService = {
  getAllTasks: async () => await TaskRepository.getAll(),
  getTaskById: async (id) => await TaskRepository.getById(id),
  createTask: async (task) => await TaskRepository.create(task),
  updateTask: async (id, task) => await TaskRepository.update(id, task),
  deleteTask: async (id) => await TaskRepository.delete(id),
};

module.exports = TaskService;
