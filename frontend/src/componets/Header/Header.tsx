import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import './Header.css';

type HeaderProps = { className?: string }

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className={`pub-header ${className ?? ''}`}>
      <Logo />
      <button className="pub-header__ham" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>
      <nav className={`pub-header__nav ${open ? 'pub-header__nav--open' : ''}`}>
        <a href="/" className="pub-header__link">Início</a>
        <a href="/sobreNos" className="pub-header__link">Sobre</a>
        <a href="/" className="pub-header__link">Serviços</a>
        <a href="/" className="pub-header__link">Contato</a>
        <a href="/login" className="pub-header__btn">Entrar</a>
      </nav>
    </header>
  );
};
export default Header;
