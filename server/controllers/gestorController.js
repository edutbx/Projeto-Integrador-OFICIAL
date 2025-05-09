const { Gestor, Login } = require("../models"); // Incluir Login para eager loading

// Obter todos os gestores
exports.getAllGestores = async (req, res) => {
  try {
    const gestores = await Gestor.findAll({
      include: [{ model: Login, as: "login" }]
    });
    res.status(200).json(gestores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter gestores", error: error.message });
  }
};

// Criar um novo gestor
exports.createGestor = async (req, res) => {
  try {
    // Adicionar validação para a chave estrangeira (Login_idLogin) se necessário
    const novoGestor = await Gestor.create(req.body);
    res.status(201).json(novoGestor);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar gestor", error: error.message });
  }
};

// Obter um gestor por ID
exports.getGestorById = async (req, res) => {
  try {
    const gestor = await Gestor.findByPk(req.params.id, {
      include: [{ model: Login, as: "login" }]
    });
    if (gestor) {
      res.status(200).json(gestor);
    } else {
      res.status(404).json({ message: "Gestor não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter gestor", error: error.message });
  }
};

// Atualizar um gestor por ID
exports.updateGestor = async (req, res) => {
  try {
    const [updated] = await Gestor.update(req.body, {
      where: { idGestor: req.params.id } // PK da tabela Gestor é idGestor
    });
    if (updated) {
      const updatedGestor = await Gestor.findByPk(req.params.id, {
        include: [{ model: Login, as: "login" }]
      });
      res.status(200).json(updatedGestor);
    } else {
      res.status(404).json({ message: "Gestor não encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar gestor", error: error.message });
  }
};

// Apagar um gestor por ID
exports.deleteGestor = async (req, res) => {
  try {
    const deleted = await Gestor.destroy({
      where: { idGestor: req.params.id } // PK da tabela Gestor é idGestor
    });
    if (deleted) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: "Gestor não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar gestor", error: error.message });
  }
};
