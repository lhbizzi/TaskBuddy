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
};

module.exports = TaskRepository;
