import React from 'react';
import { logoutGestor } from '../../services/authService';
import Logo from '../Logo/Logo';
import './GestorHeader.css';

interface GestorHeaderProps {
  nome?: string;
  sobrenome?: string;
}

const GestorIcon: React.FC = () => (
  <div className="gestor-avatar">
    <svg viewBox="0 0 56 56" fill="none" width="56" height="56">
      <circle cx="28" cy="28" r="28" fill="#FFF3D0" stroke="#F4A623" strokeWidth="2.5"/>
      <circle cx="28" cy="20" r="8" fill="#3b6bc8"/>
      <path d="M12 46c0-8.837 7.163-14 16-14s16 5.163 16 14" fill="#3b6bc8"/>
    </svg>
  </div>
);

const GestorHeader: React.FC<GestorHeaderProps> = ({
  nome = 'Gestor',
  sobrenome = '',
}) => (
  <header className="gestor-header">
    <Logo />
    <div className="gestor-header__right">
      <div className="gestor-header__info">
        <p className="gestor-header__name">{nome} {sobrenome}</p>
        <p className="gestor-header__role">Gestor do Sistema</p>
      </div>
      <GestorIcon />
      <button className="gestor-header__sair" onClick={logoutGestor}>Sair</button>
    </div>
  </header>
);

export default GestorHeader;
