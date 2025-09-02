const express = require("express");
const authenticateToken = require("../middleware/tokenMiddleware");
const loginController = require("../controllers/loginController");
const router = express.Router();

router.post("/login", loginController.login);
router.post("/register", loginController.register);

router.get("/users", authenticateToken, (req, res) =>
  authController.getAllUsers(req, res)
);
router.get("/users/:id", authenticateToken, (req, res) =>
  authController.getUserById(req, res)
);

module.exports = router;
