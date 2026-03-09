import React from 'react';
import Logo from '../componets/Logo/Logo';
import BodyCadastro from '../layout/Cadastro/BodyCadastro';
import './CadastroPage.css';

export default function Cadastro() {
  return (
    <div className="cad-page">
      <header className="cad-page__header">
        <Logo size="lg" />
      </header>
      <BodyCadastro />
    </div>
  );
}
