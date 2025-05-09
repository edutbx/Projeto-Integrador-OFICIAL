const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota de Login
// POST /api/auth/login
router.post("/login", authController.login);

// Rotas de Registo
// POST /api/auth/register/paciente
router.post("/register/paciente", authController.registerPaciente);

// POST /api/auth/register/medico
router.post("/register/medico", authController.registerMedico);

// POST /api/auth/register/gestor
router.post("/register/gestor", authController.registerGestor);

// Rota de Atualização de Senha
// PUT /api/auth/update-password
router.put("/update-password", authController.updatePassword);

module.exports = router;
