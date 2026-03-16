import React from 'react';
import Logo from '../componets/Logo/Logo';
import BodyLoginGestor from '../layout/LoginGestor/BodyLoginGestor';

export default function LoginGestor() {
  return (
    <div className="lg-page">
      <header className="lg-page__header">
        <Logo size="sm" />
        <nav className="lg-page__nav">
          <a href="/">Início</a>
          <a href="/sobreNos">Sobre</a>
          <a href="/servicos">Serviços</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>
      <BodyLoginGestor />
    </div>
  );
}
