const express = require("express");
const router = express.Router();
const AdviceController = require("../controllers/adviceController");
const tokenMiddleware = require("../middleware/tokenMiddleware");

router.post("/", tokenMiddleware, AdviceController.save);
router.put("/", tokenMiddleware, AdviceController.save);
router.get(
  "/user-task/:taskId",
  tokenMiddleware,
  AdviceController.getByUserAndTask
);

module.exports = router;
