import React from 'react';
import Logo from '../componets/Logo/Logo';
import BodyEntrar from '../layout/Entrar/BodyEntrar';

export default function Entrar() {
  return (
    <div className="entrar-page">
      <header className="entrar-page__header">
        <Logo />
        <nav className="entrar-page__nav">
          <a href="/">Início</a>
          <a href="/sobreNos">Sobre</a>
          <a href="/servicos">Serviços</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>
      <BodyEntrar />
    </div>
  );
}
