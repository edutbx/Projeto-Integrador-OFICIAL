import React from 'react';
import '../../styles/layout/BodyMedico.css';

const IcMicroscopio = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="16" y="4" width="8" height="16" rx="4" stroke="#3b6bc8" strokeWidth="2.2"/>
    <line x1="20" y1="20" x2="20" y2="30" stroke="#3b6bc8" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="10" y1="30" x2="30" y2="30" stroke="#3b6bc8" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="8" y1="16" x2="16" y2="16" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="26" cy="28" r="5" stroke="#3b6bc8" strokeWidth="2"/>
  </svg>
);
const IcProntuario = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="4" width="24" height="32" rx="3" stroke="#3b6bc8" strokeWidth="2.2"/>
    <line x1="20" y1="14" x2="20" y2="26" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="20" x2="26" y2="20" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcAgenda = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="5" y="8" width="30" height="28" rx="3" stroke="#3b6bc8" strokeWidth="2.2"/>
    <line x1="5" y1="16" x2="35" y2="16" stroke="#3b6bc8" strokeWidth="2"/>
    <line x1="13" y1="4" x2="13" y2="12" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <line x1="27" y1="4" x2="27" y2="12" stroke="#3b6bc8" strokeWidth="2" strokeLinecap="round"/>
    <rect x="11" y="21" width="5" height="5" rx="1" fill="#3b6bc8"/>
    <rect x="18" y="21" width="5" height="5" rx="1" fill="#3b6bc8"/>
    <rect x="25" y="21" width="5" height="5" rx="1" fill="#3b6bc8"/>
    <rect x="11" y="28" width="5" height="5" rx="1" fill="#3b6bc8"/>
    <rect x="18" y="28" width="5" height="5" rx="1" fill="#3b6bc8"/>
  </svg>
);

const CONSULTAS = [
  { id:1, paciente:'João Almeida de Castro',  horario:'6:00h',  info:'Informações do Paciente: Relata tosse e secreção' },
  { id:2, paciente:'Carolina Sato',           horario:'10:20h', info:'Informações do Paciente: Relata tosse e secreção' },
  { id:3, paciente:'Vinicius Mauro Souza',    horario:'12:00h', info:'Informações do Paciente: Relata tosse e secreção' },
  { id:4, paciente:'Vinicius Mauro Souza',    horario:'12:00h', info:'Informações do Paciente: Relata tosse e secreção' },
  { id:5, paciente:'Vinicius Mauro Souza',    horario:'12:00h', info:'Informações do Paciente: Relata tosse e secreção' },
  { id:6, paciente:'Vinicius Mauro Souza',    horario:'12:00h', info:'Informações do Paciente: Relata tosse e secreção' },
];

const hoje = new Date().toLocaleDateString('pt-BR');

const BodyMedico: React.FC = () => (
  <main className="med-main">
    <div className="med-top">
      <a href="/novaConsulta" className="med-iniciar-btn">INICIAR CONSULTA</a>
      <img src="/img/bonecosLogo.png" alt="" className="med-bonecos" />
    </div>
    <div className="med-acoes">
      {[
        { Icon: IcMicroscopio, label: 'Solicitar Exame', href: '/' },
        { Icon: IcProntuario,  label: 'Consultar\nProntuário', href: '/prontuario' },
        { Icon: IcProntuario,  label: 'Consultar\nPacientes', href: '/medico/pacientes' },
        { Icon: IcAgenda,      label: 'Agenda', href: '/' },
      ].map(({ Icon, label, href }) => (
        <a key={label} href={href} className="med-acao-card">
          <Icon />
          <span>{label}</span>
        </a>
      ))}
    </div>
    <div className="med-consultas">
      <h2 className="med-consultas__titulo">Consultas de hoje - {hoje}</h2>
      <div className="med-consultas__grid">
        {CONSULTAS.map(c => (
          <div key={c.id} className="med-card">
            <div className="med-card__avatar"><img src="/img/icon.png" alt={c.paciente} /></div>
            <div className="med-card__info">
              <p className="med-card__nome">{c.paciente}</p>
              <p className="med-card__horario">Horário: {c.horario}</p>
              <p className="med-card__obs">{c.info}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
);
export default BodyMedico;
