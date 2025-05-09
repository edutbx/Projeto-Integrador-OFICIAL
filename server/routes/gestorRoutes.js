const express = require("express");
const router = express.Router();
const gestorController = require("../controllers/gestorController");

// Rota para obter todos os gestores
router.get("/gestores", gestorController.getAllGestores);

// Rota para criar um novo gestor
router.post("/gestores", gestorController.createGestor);

// Rota para obter um gestor por ID
router.get("/gestores/:id", gestorController.getGestorById);

// Rota para atualizar um gestor por ID
router.put("/gestores/:id", gestorController.updateGestor);

// Rota para apagar um gestor por ID
router.delete("/gestores/:id", gestorController.deleteGestor);

module.exports = router;
