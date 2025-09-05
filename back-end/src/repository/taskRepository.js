// Operações de banco de dados para tarefas
const db = require("../database");
const { ObjectId } = require("mongodb");

const TaskRepository = {
  getAll: async () => {
    const tasks = await db.collection("tasks").find({}).toArray();
    return tasks;
  },
  getById: async (id) => {
    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(id) });
    return task;
  },
  create: async (task) => {
    const result = await db.collection("tasks").insertOne(task);
    return { ...task, _id: result.insertedId };
  },
  update: async (id, task) => {
    await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(id) }, { $set: task });
    return await TaskRepository.getById(id);
  },
  delete: async (id) => {
    await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
    return true;
  },
  getByUserId: async (userId) => {
    const tasks = await db.collection("tasks").find({ userId }).toArray();
    return tasks;
  },
  getByDueDate: async (dueDate) => {
    // Busca tarefas com dueDate no dia informado (intervalo do dia)
    // dueDate pode ser 'YYYY-MM-DD' ou data ISO
    const start = new Date(dueDate + "T00:00:00.000Z");
    const end = new Date(dueDate + "T23:59:59.999Z");
    // Busca tanto por dueDate exato quanto por intervalo (caso salve como ISO futuramente)
    return await db
      .collection("tasks")
      .find({
        $or: [
          { dueDate: dueDate },
          { dueDate: { $gte: start.toISOString(), $lte: end.toISOString() } },
        ],
      })
      .toArray();
  },
  getByCreatedAt: async (createdAt) => {
    // Busca tarefas criadas no dia informado (intervalo do dia)
    // createdAt deve ser passado como 'YYYY-MM-DD'
    const start = new Date(createdAt + "T00:00:00.000Z");
    const end = new Date(createdAt + "T23:59:59.999Z");
    return await db
      .collection("tasks")
      .find({
        createdAt: { $gte: start.toISOString(), $lte: end.toISOString() },
      })
      .toArray();
  },
};

module.exports = TaskRepository;
