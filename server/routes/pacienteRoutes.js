const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

// Rota para obter todos os pacientes
router.get("/pacientes", pacienteController.getAllPacientes);

// Rota para criar um novo paciente
router.post("/pacientes", pacienteController.createPaciente);

// Rota para obter um paciente por ID
router.get("/pacientes/:id", pacienteController.getPacienteById);

// Rota para atualizar um paciente por ID
router.put("/pacientes/:id", pacienteController.updatePaciente);

// Rota para apagar um paciente por ID
router.delete("/pacientes/:id", pacienteController.deletePaciente);

module.exports = router;
