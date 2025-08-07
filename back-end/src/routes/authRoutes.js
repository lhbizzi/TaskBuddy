// filepath: c:\Users\lucas\OneDrive\Área de Trabalho\TaskBuddy\back-end\src\routes\authRoutes.js
const express = require('express');
const AuthController = require('../controllers/authController');

const setAuthRoutes = (app) => {
    const authController = new AuthController();
    const router = express.Router();

    router.post('/register', authController.register.bind(authController));
    router.post('/login', authController.login.bind(authController));

    app.use('/auth', router);
};

module.exports = setAuthRoutes;