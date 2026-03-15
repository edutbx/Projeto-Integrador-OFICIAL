import React from 'react';
import Logo from '../Logo/Logo';
import '../../styles/components/Footer.css';

type FooterProps = { className?: string }

const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={`footer ${className ?? ''}`}>
    <div className="footer__top">
      <Logo size="md" />
      <div className="footer__cols">
        <div className="footer__col">
          <p className="footer__title">Links rápidos</p>
          <a href="/">Início</a>
          <a href="/sobreNos">Sobre o Saúde++</a>
          <a href="/servicos">Serviços</a>
        </div>
        <div className="footer__col">
          <p className="footer__title">Plataforma</p>
          <a href="/login">Login Médico</a>
          <a href="/login-gestor">Login Gestor</a>
        </div>
        <div className="footer__col">
          <p className="footer__title">Contato</p>
          <span className="footer__contact">contato@saudemais.com.br</span>
          <span className="footer__contact">0800 111 2222</span>
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <p>© 2026 Saúde ++. Todos os direitos reservados.</p>
    </div>
  </footer>
);
export default Footer;
