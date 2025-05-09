const { Paciente } = require("../models"); // Ajuste o caminho se os modelos não estiverem sendo exportados por um index.js em models

// Obter todos os pacientes
exports.getAllPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.status(200).json(pacientes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter pacientes", error: error.message });
  }
};

// Criar um novo paciente
exports.createPaciente = async (req, res) => {
  try {
    const novoPaciente = await Paciente.create(req.body);
    res.status(201).json(novoPaciente);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar paciente", error: error.message });
  }
};

// Obter um paciente por ID
exports.getPacienteById = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);
    if (paciente) {
      res.status(200).json(paciente);
    } else {
      res.status(404).json({ message: "Paciente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter paciente", error: error.message });
  }
};

// Atualizar um paciente por ID
exports.updatePaciente = async (req, res) => {
  try {
    const [updated] = await Paciente.update(req.body, {
      where: { idPaciente: req.params.id } // Assumindo que a PK é idPaciente
    });
    if (updated) {
      const updatedPaciente = await Paciente.findByPk(req.params.id);
      res.status(200).json(updatedPaciente);
    } else {
      res.status(404).json({ message: "Paciente não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar paciente", error: error.message });
  }
};

// Apagar um paciente por ID
exports.deletePaciente = async (req, res) => {
  try {
    const deleted = await Paciente.destroy({
      where: { idPaciente: req.params.id } // Assumindo que a PK é idPaciente
    });
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: "Paciente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar paciente", error: error.message });
  }
};
