import React from 'react';
import '../../styles/layout/BodyEntrar.css';

const IconeMedico = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill="#EEF4FF"/>
    <circle cx="32" cy="22" r="10" fill="#3b6bc8"/>
    <path d="M14 54c0-9.941 8.059-16 18-16s18 6.059 18 16" fill="#3b6bc8"/>
    <circle cx="42" cy="38" r="8" fill="none" stroke="#f4a623" strokeWidth="2.5"/>
    <path d="M42 34v8M38 38h8" stroke="#f4a623" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconeGestor = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill="#FFF8E8"/>
    <circle cx="32" cy="22" r="10" fill="#f4a623"/>
    <path d="M14 54c0-9.941 8.059-16 18-16s18 6.059 18 16" fill="#f4a623"/>
    <rect x="40" y="34" width="14" height="10" rx="3" fill="none" stroke="#3b6bc8" strokeWidth="2.5"/>
    <path d="M44 34v-3a3 3 0 016 0v3" stroke="#3b6bc8" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const BodyEntrar: React.FC = () => (
  <div className="entrar__body">
    <div className="entrar__inner">
      <h1 className="entrar__title">BEM-VINDO AO SAÚDE++</h1>
      <p className="entrar__subtitle">Selecione seu perfil de acesso para continuar</p>

      <div className="entrar__cards">
        {/* Card Médico */}
        <a href="/login" className="entrar__card">
          <div className="entrar__card-icon"><IconeMedico /></div>
          <h2 className="entrar__card-title">Médico</h2>
          <p className="entrar__card-desc">
            Acesse seus prontuários, registre consultas e visualize o histórico dos seus pacientes.
          </p>
          <span className="entrar__card-btn">Acessar</span>
        </a>

        {/* Card Gestor */}
        <a href="/login-gestor" className="entrar__card entrar__card--gestor">
          <div className="entrar__card-icon"><IconeGestor /></div>
          <h2 className="entrar__card-title">Gestor</h2>
          <p className="entrar__card-desc">
            Gerencie sua equipe médica, acompanhe indicadores e cadastre novos profissionais.
          </p>
          <span className="entrar__card-btn entrar__card-btn--gestor">Acessar</span>
        </a>
      </div>
    </div>
  </div>
);

export default BodyEntrar;
