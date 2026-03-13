import React from 'react';
import Header from '../componets/Header/Header';
import BodyServicos from '../layout/Servicos/BodyServicos';
import Footer from '../componets/Footer/Footer';

export default function Servicos() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <BodyServicos />
      <Footer />
    </div>
  );
}
