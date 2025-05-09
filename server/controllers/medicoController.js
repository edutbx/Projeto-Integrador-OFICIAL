const { Medico, Login, Endereco, Gestor } = require("../models"); // Ajuste para incluir todos os modelos associados se necessário para includes em queries

// Obter todos os médicos
exports.getAllMedicos = async (req, res) => {
  try {
    const medicos = await Medico.findAll({
      include: [
        { model: Login, as: "login" },
        { model: Endereco, as: "endereco" },
        { model: Gestor, as: "gestorAprovador" }
      ]
    });
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter médicos", error: error.message });
  }
};

// Criar um novo médico
exports.createMedico = async (req, res) => {
  try {
    // Adicionar validação para chaves estrangeiras (Login_idLogin, Endereco_idEndereco) se necessário
    // Por exemplo, verificar se os IDs fornecidos existem nas tabelas Login e Endereco
    const novoMedico = await Medico.create(req.body);
    res.status(201).json(novoMedico);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar médico", error: error.message });
  }
};

// Obter um médico por ID
exports.getMedicoById = async (req, res) => {
  try {
    const medico = await Medico.findByPk(req.params.id, {
      include: [
        { model: Login, as: "login" },
        { model: Endereco, as: "endereco" },
        { model: Gestor, as: "gestorAprovador" }
      ]
    });
    if (medico) {
      res.status(200).json(medico);
    } else {
      res.status(404).json({ message: "Médico não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter médico", error: error.message });
  }
};

// Atualizar um médico por ID
exports.updateMedico = async (req, res) => {
  try {
    const [updated] = await Medico.update(req.body, {
      where: { idMedico: req.params.id } // PK da tabela Medico é idMedico
    });
    if (updated) {
      const updatedMedico = await Medico.findByPk(req.params.id, {
        include: [
        { model: Login, as: "login" },
        { model: Endereco, as: "endereco" },
        { model: Gestor, as: "gestorAprovador" }
      ]
      });
      res.status(200).json(updatedMedico);
    } else {
      res.status(404).json({ message: "Médico não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar médico", error: error.message });
  }
};

// Apagar um médico por ID
exports.deleteMedico = async (req, res) => {
  try {
    const deleted = await Medico.destroy({
      where: { idMedico: req.params.id } // PK da tabela Medico é idMedico
    });
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: "Médico não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar médico", error: error.message });
  }
};
