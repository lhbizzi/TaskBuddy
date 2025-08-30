const express = require("express");
const authenticateToken = require("../middleware/tokenMiddleware");
const authController = require("../controllers/loginController");
const router = express.Router();

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));

router.get("/users", authenticateToken, (req, res) =>
  authController.getAllUsers(req, res)
);
router.get("/users/:id", authenticateToken, (req, res) =>
  authController.getUserById(req, res)
);

module.exports = router;
