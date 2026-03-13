import React from 'react';
import Header from '../componets/Header/Header';
import BodyContato from '../layout/Contato/BodyContato';
import Footer from '../componets/Footer/Footer';

export default function Contato() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      <BodyContato />
      <Footer />
    </div>
  );
}
