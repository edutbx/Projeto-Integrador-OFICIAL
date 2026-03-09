import React from 'react';
import './Logo.css';

interface LogoProps { size?: 'sm' | 'md' | 'lg'; }

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => (
  <a href="/" className={`logo logo--${size}`}>
    <span className="logo__saude">SAÚDE</span>
    <span className="logo__plus">
      <span className="logo__plus-red">+</span>
      <span className="logo__plus-orange">+</span>
    </span>
  </a>
);
export default Logo;
