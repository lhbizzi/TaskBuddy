// Métodos do CRUD de tarefas
const TaskService = require("../services/taskService");

const { getTaskAdvice } = require("../services/openaiService");

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
    const { title, description, status, dueDate, userId } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Título e descrição são obrigatórios.",
        });
    }
    const task = { title, description, status, dueDate, userId };
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
  getAdvice: async (req, res) => {
    const { tarefa, deadline } = req.body;
    if (!tarefa) {
      return res
        .status(400)
        .json({ success: false, message: "A tarefa é obrigatória." });
    }
    try {
      const advice = await getTaskAdvice(tarefa, deadline);
      res.json({ success: true, advice });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao consultar IA.",
        error: error.message,
      });
    }
  },
};

module.exports = TaskController;
