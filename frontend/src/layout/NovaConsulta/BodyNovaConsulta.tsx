import React, { useState } from 'react';
import { buscarPacientePorCpfComoMedico } from '../../services/pacienteService';
import '../../styles/layout/BodyNovaConsulta.css';

function formatarCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

const BodyNovaConsulta: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function handleCpfChange(value: string) {
    setCpf(formatarCpf(value));
    setErro(null);
  }

  async function iniciar() {
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('Digite um CPF completo (11 dígitos).');
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const paciente = await buscarPacientePorCpfComoMedico(cpfDigits);
      window.location.href = `/prontuario?pacienteId=${paciente.id}`;
    } catch (err) {

      setErro('Paciente não cadastrado. Consulte o gestor para realizar o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="nc-main">
      <input
        className="nc-cpf"
        type="text"
        placeholder="Insira o CPF do paciente"
        value={cpf}
        onChange={e => handleCpfChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !carregando && iniciar()}
        maxLength={14}
        disabled={carregando}
      />
      {erro && (
        <div className="nc-alerta-container">
          <div className="nc-alerta-card">
            <div className="nc-alerta-texto">
              <strong>⚠️Atenção</strong>
              <p>{erro}</p>
            </div>
          </div>
        </div>
      )}
      <div className="nc-iniciar-row">
        <button
          className="nc-iniciar-btn"
          onClick={iniciar}
          disabled={cpf.replace(/\D/g, '').length !== 11 || carregando}
        >
          {carregando ? 'Buscando...' : 'INICIAR CONSULTA'}
        </button>
        <img src="/img/bonecosLogo.png" alt="" className="nc-bonecos" />
      </div>
      <button className="nc-voltar" onClick={() => window.location.href = '/medico'}>Voltar</button>
    </main>
  );
};

export default BodyNovaConsulta;
