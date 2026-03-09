import React from 'react';
import Logo from '../componets/Logo/Logo';
import BodyLogin from '../layout/Login/BodyLogin';
import './LoginPage.css';

export default function Login() {
  return (
    <div className="login-page">
      <header className="login-page__header">
        <Logo />
        <nav className="login-page__nav">
          <a href="/">Início</a>
          <a href="/sobreNos">Sobre</a>
          <a href="/">Serviços</a>
          <a href="/">Contato</a>
        </nav>
      </header>
      <BodyLogin />
    </div>
  );
}
