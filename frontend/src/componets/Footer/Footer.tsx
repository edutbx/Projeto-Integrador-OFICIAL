import React from 'react';
import Logo from '../Logo/Logo';
import './Footer.css';

type FooterProps = { className?: string }

const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={`footer ${className ?? ''}`}>
    <div className="footer__top">
      <Logo size="md" />
      <div className="footer__cols">
        <div className="footer__col">
          <p className="footer__title">Sobre</p>
          <a href="/">Sobre o Saúde++</a>
          <a href="/">Termos de Uso e Políticas de Privacidade</a>
          <a href="/">Trabalhe conosco</a>
          <a href="/">Dúvidas Frequentes</a>
        </div>
        <div className="footer__col">
          <p className="footer__title">Serviços</p>
          <a href="/">Exames</a>
          <a href="/">Testes</a>
          <a href="/">Check-up</a>
          <a href="/">Prontuário online</a>
        </div>
        <div className="footer__col">
          <p className="footer__title">Contato</p>
          <span className="footer__contact">contato@saudemais.com.br</span>
          <span className="footer__contact">0800 111 2222</span>
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <p>© 2025 Saúde ++. Todos os direitos reservados.</p>
    </div>
  </footer>
);
export default Footer;
