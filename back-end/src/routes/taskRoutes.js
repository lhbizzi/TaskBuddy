// Rotas para tarefas
const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

router.get("/", TaskController.getAll);
router.get("/:id", TaskController.getById);
router.get("/user/:userId", TaskController.getByUserId);
router.post("/", TaskController.create);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);
// Rota para obter plano de ação via OpenAI
router.post("/advice", TaskController.getAdvice);

module.exports = router;
