const express = require("express");
const AuthController = require("../services/loginService");
const router = express.Router();

const authController = new AuthController();

router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));

module.exports = router;
