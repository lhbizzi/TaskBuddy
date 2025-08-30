// Métodos do CRUD de tarefas
const TaskService = require("../services/taskService");

const TaskController = {
  getAll: async (req, res) => {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  },
  getById: async (req, res) => {
    const { id } = req.params;
    const task = await TaskService.getTaskById(id);
    res.json(task);
  },
  create: async (req, res) => {
    const task = req.body;
    const newTask = await TaskService.createTask(task);
    res.status(201).json(newTask);
  },
  update: async (req, res) => {
    const { id } = req.params;
    const task = req.body;
    const updatedTask = await TaskService.updateTask(id, task);
    res.json(updatedTask);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    await TaskService.deleteTask(id);
    res.status(204).send();
  },
};

module.exports = TaskController;
