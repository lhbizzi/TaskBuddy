// Operações de banco de dados para tarefas
const db = require("../database");

const TaskRepository = {
  getAll: async () => {
    // Exemplo: return await db.query('SELECT * FROM tasks');
  },
  getById: async (id) => {
    // Exemplo: return await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  },
  create: async (task) => {
    // Exemplo: return await db.query('INSERT INTO tasks SET ?', task);
  },
  update: async (id, task) => {
    // Exemplo: return await db.query('UPDATE tasks SET ? WHERE id = ?', [task, id]);
  },
  delete: async (id) => {
    // Exemplo: return await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  },
};

module.exports = TaskRepository;
