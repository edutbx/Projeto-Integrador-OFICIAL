import React from 'react';
import '../../styles/components/Logo.css';

interface LogoProps { size?: 'sm' | 'md' | 'lg'; href?: string; }

const HEIGHTS = { sm: 32, md: 48, lg: 72 };

const Logo: React.FC<LogoProps> = ({ size = 'md', href = '/' }) => (
  <a href={href} className="logo">
    <img src="/img/Logo.png" alt="Saúde++" height={HEIGHTS[size]} />
  </a>
);
export default Logo;
