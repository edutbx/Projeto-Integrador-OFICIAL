const { AceiteTermo, Login, TermoDeUso } = require("../models");

const aceitesTermoIniciais = [
  // Assumindo que o Login com CPF '111.222.333-44' (idLogin=1) aceita o TermoDeUso com TituloTermo 'Termos de Uso Iniciais da Plataforma' (idTermoDeUso=1)
  {
    Login_idLogin_CPF: "111.222.333-44",
    TermoDeUso_idTermoDeUso_Titulo_Versao: { TituloTermo: "Termos de Uso Iniciais da Plataforma", NumeroVersao: 1.0 },
    DataHoraAceite: new Date()
  },
  // Assumindo que o Login com CPF '222.333.444-55' (idLogin=2) aceita a Política de Privacidade v1.1 (idTermoDeUso=2)
  {
    Login_idLogin_CPF: "222.333.444-55",
    TermoDeUso_idTermoDeUso_Titulo_Versao: { TituloTermo: "Política de Privacidade v1.1", NumeroVersao: 1.1 },
    DataHoraAceite: new Date()
  },
  // Assumindo que o Login com CPF '333.444.555-66' (idLogin=3, medico) aceita os Termos de Uso Iniciais
  {
    Login_idLogin_CPF: "333.444.555-66",
    TermoDeUso_idTermoDeUso_Titulo_Versao: { TituloTermo: "Termos de Uso Iniciais da Plataforma", NumeroVersao: 1.0 },
    DataHoraAceite: new Date()
  }
];

async function seedAceitesTermo() {
  try {
    for (const aceiteData of aceitesTermoIniciais) {
      const loginInstance = await Login.findOne({ where: { CPF: aceiteData.Login_idLogin_CPF } });
      const termoInstance = await TermoDeUso.findOne({ 
        where: { 
          TituloTermo: aceiteData.TermoDeUso_idTermoDeUso_Titulo_Versao.TituloTermo,
          NumeroVersao: aceiteData.TermoDeUso_idTermoDeUso_Titulo_Versao.NumeroVersao
        }
      });

      if (!loginInstance) {
        console.warn(`Login com CPF ${aceiteData.Login_idLogin_CPF} não encontrado para o AceiteTermo. Pulando.`);
        continue;
      }
      if (!termoInstance) {
        console.warn(`Termo de Uso "${aceiteData.TermoDeUso_idTermoDeUso_Titulo_Versao.TituloTermo} v${aceiteData.TermoDeUso_idTermoDeUso_Titulo_Versao.NumeroVersao}" não encontrado para o AceiteTermo. Pulando.`);
        continue;
      }

      const [aceite, created] = await AceiteTermo.findOrCreate({
        where: { 
          Login_idLogin: loginInstance.idLogin,
          TermoDeUso_idTermoDeUso: termoInstance.idTermoDeUso
        },
        defaults: {
          DataHoraAceite: aceiteData.DataHoraAceite,
          Login_idLogin: loginInstance.idLogin,
          TermoDeUso_idTermoDeUso: termoInstance.idTermoDeUso
        }
      });

      if (created) {
        console.log(`AceiteTermo para Login ID ${loginInstance.idLogin} e Termo ID ${termoInstance.idTermoDeUso} inserido com sucesso.`);
      } else {
        console.log(`AceiteTermo para Login ID ${loginInstance.idLogin} e Termo ID ${termoInstance.idTermoDeUso} já existe.`);
      }
    }
    console.log("Seeding de Aceites de Termo concluído.");
  } catch (error) {
    console.error("Erro ao inserir Aceites de Termo iniciais:", error);
  }
}

module.exports = seedAceitesTermo;
