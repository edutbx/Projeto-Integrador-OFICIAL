import React from 'react';
import { useAuthGestor } from '../hooks/useAuthGestor';
import GestorHeader from '../componets/GestorHeader/GestorHeader';
import BodyGestor from '../layout/Gestor/BodyGestor';

export default function Gestor() {
  const { autenticado, gestor } = useAuthGestor({ proteger: true });

  if (autenticado === null) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#3b6bc8' }}>
      Verificando sessão...
    </div>
  );

  return (
    <div className="gestor-page">
      <GestorHeader nome={gestor?.nome} sobrenome={gestor?.sobrenome} />
      <BodyGestor />
    </div>
  );
}
