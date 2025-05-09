const { Login, Paciente, Medico, Gestor, Endereco, QuestionarioSaude, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

// Função auxiliar para hashear senhas
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

exports.login = async (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha são obrigatórios." });
  }

  try {
    const loginInstance = await Login.findOne({ where: { CPF: cpf } });

    if (!loginInstance) {
      return res.status(401).json({ message: "CPF não encontrado." });
    }

    const isMatch = await bcrypt.compare(senha, loginInstance.Senha);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    let userDetails = null;
    const commonLoginInfo = {
      idLogin: loginInstance.idLogin,
      CPF: loginInstance.CPF,
      TipoUsuario: loginInstance.TipoUsuario
    };

    if (loginInstance.TipoUsuario === "paciente") {
      userDetails = await Paciente.findOne({
        where: { Login_idLogin: loginInstance.idLogin },
        include: [
          { model: Endereco, as: "endereco" },
          { model: QuestionarioSaude, as: "questionarioSaude" }
        ]
      });
    } else if (loginInstance.TipoUsuario === "medico") {
      userDetails = await Medico.findOne({
        where: { Login_idLogin: loginInstance.idLogin },
        include: [
          { model: Endereco, as: "endereco" },
          { model: Gestor, as: "gestorAprovador" }
        ]
      });
    } else if (loginInstance.TipoUsuario === "gestor") {
      userDetails = await Gestor.findOne({ where: { Login_idLogin: loginInstance.idLogin } });
    } else {
      return res.status(403).json({ message: "Tipo de utilizador desconhecido." });
    }

    if (!userDetails) {
      return res.status(404).json({ message: "Detalhes do utilizador não encontrados para este login." });
    }

    const fullUserInfo = { ...commonLoginInfo, ...userDetails.toJSON() };
    res.status(200).json({ message: "Login bem-sucedido!", user: fullUserInfo });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno do servidor ao tentar fazer login.", error: error.message });
  }
};

exports.registerPaciente = async (req, res) => {
  const {
    cpfLogin, senha, nomePaciente, sobrenomePaciente, emailPaciente, telefonePaciente,
    rgPaciente, dataNascPaciente, sexoPaciente, logradouro, cep, cidade, estado,
    numeroEndereco, complementoEndereco, preCondicao, alergia, cirurgia, alcool, fuma
  } = req.body;

  if (!cpfLogin || !senha || !nomePaciente || !sobrenomePaciente || !emailPaciente || !rgPaciente || !dataNascPaciente || !sexoPaciente || !logradouro || !cep || !cidade || !estado) {
    return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  const t = await sequelize.transaction();

  try {
    const existingLogin = await Login.findOne({ where: { CPF: cpfLogin }, transaction: t });
    if (existingLogin) {
      await t.rollback();
      return res.status(409).json({ message: "CPF já registado para um login." });
    }
    const existingPacienteByEmail = await Paciente.findOne({ where: { Email: emailPaciente }, transaction: t });
    if (existingPacienteByEmail) {
      await t.rollback();
      return res.status(409).json({ message: "Email já registado para um paciente." });
    }
    const existingPacienteByRG = await Paciente.findOne({ where: { RG: rgPaciente }, transaction: t });
    if (existingPacienteByRG) {
      await t.rollback();
      return res.status(409).json({ message: "RG já registado para um paciente." });
    }

    const novoEndereco = await Endereco.create({
      Logadouro: logradouro, CEP: cep, Cidade: cidade, Estado: estado,
      Numero: numeroEndereco, Complemento: complementoEndereco
    }, { transaction: t });

    const novoQuestionario = await QuestionarioSaude.create({
      PreCondicao: preCondicao || 'N', Alergia: alergia || 'N', Cirurgia: cirurgia || 'N',
      Alcool: alcool || 'N', Fuma: fuma || 'N'
    }, { transaction: t });

    const hashedSenha = await hashPassword(senha);
    const novoLogin = await Login.create({
      CPF: cpfLogin, Senha: hashedSenha, TipoUsuario: "paciente"
    }, { transaction: t });

    const novoPaciente = await Paciente.create({
      Nome: nomePaciente, Sobrenome: sobrenomePaciente, Email: emailPaciente, Telefone: telefonePaciente,
      RG: rgPaciente, DataNasc: dataNascPaciente, Sexo: sexoPaciente,
      Endereco_idEndereco: novoEndereco.idEndereco,
      Login_idLogin: novoLogin.idLogin,
      QuestionarioSaude_idQuestionarioSaude: novoQuestionario.idQuestionarioSaude
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Paciente registado com sucesso!",
      paciente: { idPaciente: novoPaciente.idPaciente, nome: novoPaciente.Nome, email: novoPaciente.Email, login: { idLogin: novoLogin.idLogin, CPF: novoLogin.CPF } }
    });

  } catch (error) {
    await t.rollback();
    console.error("Erro ao registar paciente:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Erro de validação ao criar paciente.", errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Erro interno do servidor ao tentar registar paciente.", error: error.message });
  }
};

exports.registerMedico = async (req, res) => {
  const {
    cpfLogin, senha, nomeMedico, sobrenomeMedico, cpfMedico, rgMedico, crmMedico, 
    dataNascMedico, sexoMedico, especializacaoMedico, logradouro, cep, cidade, estado, 
    numeroEndereco, complementoEndereco, gestorAprovadorId
  } = req.body;

  if (!cpfLogin || !senha || !nomeMedico || !sobrenomeMedico || !cpfMedico || !crmMedico || !dataNascMedico || !sexoMedico || !logradouro || !cep || !cidade || !estado) {
    return res.status(400).json({ message: "Todos os campos obrigatórios para médico devem ser preenchidos." });
  }

  const t = await sequelize.transaction();

  try {
    const existingLogin = await Login.findOne({ where: { CPF: cpfLogin }, transaction: t });
    if (existingLogin) {
      await t.rollback();
      return res.status(409).json({ message: "CPF de login já registado." });
    }
    const existingMedicoByCPF = await Medico.findOne({ where: { CPF: cpfMedico }, transaction: t });
    if (existingMedicoByCPF) {
      await t.rollback();
      return res.status(409).json({ message: "CPF do médico já registado." });
    }
    const existingMedicoByCRM = await Medico.findOne({ where: { CRM: crmMedico }, transaction: t });
    if (existingMedicoByCRM) {
      await t.rollback();
      return res.status(409).json({ message: "CRM do médico já registado." });
    }

    const novoEndereco = await Endereco.create({
      Logadouro: logradouro, CEP: cep, Cidade: cidade, Estado: estado,
      Numero: numeroEndereco, Complemento: complementoEndereco
    }, { transaction: t });

    const hashedSenha = await hashPassword(senha);
    const novoLogin = await Login.create({
      CPF: cpfLogin, Senha: hashedSenha, TipoUsuario: "medico"
    }, { transaction: t });

    const novoMedico = await Medico.create({
      Nome: nomeMedico, Sobrenome: sobrenomeMedico, CPF: cpfMedico, RG: rgMedico, CRM: crmMedico,
      DataNasc: dataNascMedico, Sexo: sexoMedico, Especializacao: especializacaoMedico,
      Login_idLogin: novoLogin.idLogin,
      Endereco_idEndereco: novoEndereco.idEndereco,
      GestorAprovador_idGestor: gestorAprovadorId || null
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Médico registado com sucesso!",
      medico: { idMedico: novoMedico.idMedico, nome: novoMedico.Nome, crm: novoMedico.CRM, login: { idLogin: novoLogin.idLogin, CPF: novoLogin.CPF } }
    });

  } catch (error) {
    await t.rollback();
    console.error("Erro ao registar médico:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Erro de validação ao criar médico.", errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Erro interno do servidor ao tentar registar médico.", error: error.message });
  }
};

exports.registerGestor = async (req, res) => {
  const { cpfLogin, senha, nomeGestor, cpfGestor, cargoGestor } = req.body;

  if (!cpfLogin || !senha || !nomeGestor || !cpfGestor) {
    return res.status(400).json({ message: "Todos os campos obrigatórios para gestor devem ser preenchidos." });
  }

  const t = await sequelize.transaction();

  try {
    const existingLogin = await Login.findOne({ where: { CPF: cpfLogin }, transaction: t });
    if (existingLogin) {
      await t.rollback();
      return res.status(409).json({ message: "CPF de login já registado." });
    }
    const existingGestorByCPF = await Gestor.findOne({ where: { CPF: cpfGestor }, transaction: t });
    if (existingGestorByCPF) {
      await t.rollback();
      return res.status(409).json({ message: "CPF do gestor já registado." });
    }

    const hashedSenha = await hashPassword(senha);
    const novoLogin = await Login.create({
      CPF: cpfLogin, Senha: hashedSenha, TipoUsuario: "gestor"
    }, { transaction: t });

    const novoGestor = await Gestor.create({
      Nome: nomeGestor, CPF: cpfGestor, Cargo: cargoGestor,
      Login_idLogin: novoLogin.idLogin
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Gestor registado com sucesso!",
      gestor: { idGestor: novoGestor.idGestor, nome: novoGestor.Nome, cpf: novoGestor.CPF, login: { idLogin: novoLogin.idLogin, CPF: novoLogin.CPF } }
    });

  } catch (error) {
    await t.rollback();
    console.error("Erro ao registar gestor:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Erro de validação ao criar gestor.", errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: "Erro interno do servidor ao tentar registar gestor.", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { cpf, senhaAntiga, novaSenha } = req.body;

  if (!cpf || !novaSenha) {
    return res.status(400).json({ message: "CPF e nova senha são obrigatórios." });
  }

  if (novaSenha.length < 6) {
    return res.status(400).json({ message: "A nova senha deve ter pelo menos 6 caracteres." });
  }

  const t = await sequelize.transaction();

  try {
    const loginInstance = await Login.findOne({ where: { CPF: cpf }, transaction: t });

    if (!loginInstance) {
      await t.rollback();
      return res.status(404).json({ message: "CPF não encontrado." });
    }

    if (senhaAntiga) {
      const isMatch = await bcrypt.compare(senhaAntiga, loginInstance.Senha);
      if (!isMatch) {
        await t.rollback();
        return res.status(401).json({ message: "Senha antiga incorreta." });
      }
    }

    const hashedNovaSenha = await hashPassword(novaSenha);
    loginInstance.Senha = hashedNovaSenha;
    await loginInstance.save({ transaction: t });

    await t.commit();
    res.status(200).json({ message: "Senha atualizada com sucesso!" });

  } catch (error) {
    await t.rollback();
    console.error("Erro ao atualizar senha:", error);
    res.status(500).json({ message: "Erro interno do servidor ao tentar atualizar a senha.", error: error.message });
  }
};
