import React, { useState } from 'react';
import '../../styles/layout/BodyNovaConsulta.css';

const BodyNovaConsulta: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const iniciar = () => { if (cpf.trim()) window.location.href = `/prontuario?cpf=${cpf}`; };
  return (
    <main className="nc-main">
      <input className="nc-cpf" type="text" placeholder="Insira o CPF do paciente"
        value={cpf} onChange={e => setCpf(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && iniciar()} maxLength={14} />
      <div className="nc-iniciar-row">
        <button className="nc-iniciar-btn" onClick={iniciar} disabled={!cpf.trim()}>INICIAR CONSULTA</button>
        <img src="/img/bonecosLogo.png" alt="" className="nc-bonecos" />
      </div>
      <button className="nc-voltar" onClick={() => window.location.href = '/medico'}>Voltar</button>
    </main>
  );
};
export default BodyNovaConsulta;
