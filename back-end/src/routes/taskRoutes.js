// Rotas para tarefas
const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/tokenMiddleware");

router.get("/", TaskController.getAll);
router.get("/:id", TaskController.getById);
router.get("/user/:userId", TaskController.getByUserId);
router.post("/", authenticateToken, TaskController.create);
router.put("/:id", authenticateToken, TaskController.update);
router.delete("/:id", authenticateToken, TaskController.delete);
// Rota para obter plano de ação via OpenAI
router.post("/advice", TaskController.getAdvice);

module.exports = router;
