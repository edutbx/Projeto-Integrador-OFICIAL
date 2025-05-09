const express = require("express");
const router = express.Router();
const medicoController = require("../controllers/medicoController");

// Rota para obter todos os médicos
router.get("/medicos", medicoController.getAllMedicos);

// Rota para criar um novo médico
router.post("/medicos", medicoController.createMedico);

// Rota para obter um médico por ID
router.get("/medicos/:id", medicoController.getMedicoById);

// Rota para atualizar um médico por ID
router.put("/medicos/:id", medicoController.updateMedico);

// Rota para apagar um médico por ID
router.delete("/medicos/:id", medicoController.deleteMedico);

module.exports = router;
