import React from 'react';
import { logout } from '../../services/authService';
import Logo from '../Logo/Logo';
import './DoctorHeader.css';

interface DoctorHeaderProps { nome?: string; sobrenome?: string, crm?: string; especializacao?: string; }

const DoctorIcon: React.FC = () => (
  <div className="doc-avatar">
    <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
      <circle cx="28" cy="28" r="28" fill="#FFF3D0" stroke="#F4A623" strokeWidth="2.5"/>
      <circle cx="28" cy="20" r="8" fill="#3b6bc8"/>
      <path d="M12 46c0-8.837 7.163-14 16-14s16 5.163 16 14" fill="#3b6bc8"/>
      <circle cx="36" cy="34" r="5" fill="none" stroke="#F4A623" strokeWidth="2"/>
      <path d="M36 39v4" stroke="#F4A623" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ nome = 'Médico', sobrenome = 'Médico', crm = 'Crm', especializacao = 'Especialidade' }) => (
  <header className="doc-header">
    <Logo />
    <div className="doc-header__right">
      <div className="doc-header__info">
        <p className="doc-header__name"><span className="doc-header__dr">Dr: </span>{nome} {sobrenome}</p>
        <p className="doc-header__crm"><strong>CRM:</strong> {crm}</p>
          <p className="doc-header__spec"><strong>Especialização:</strong> {especializacao}</p>
      </div>
      <DoctorIcon />
      <button className="doc-header__sair" onClick={logout}>Sair</button>
    </div>
  </header>
);
export default DoctorHeader;
