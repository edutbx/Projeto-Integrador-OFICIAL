import React, { useState, useEffect } from 'react';
import Header from '../componets/Header/Header';
import BodySobreNos from '../layout/SobreNos/BodySobreNos';
import Footer from '../componets/Footer/Footer';

export default function SobreNos() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="sobre-page">
      <Header />
      <BodySobreNos />
      <Footer />
      {showTop && (
        <button className="sobre__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
            <circle cx="24" cy="24" r="24" fill="#f4a623"/>
            <path d="M24 32V16M16 24l8-8 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span>Volte ao topo</span>
        </button>
      )}
    </div>
  );
}
