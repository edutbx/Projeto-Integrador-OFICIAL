import React from 'react';
import { useAuthGestor } from '../hooks/useAuthGestor';
import GestorHeader from '../componets/GestorHeader/GestorHeader';
import BodyGestorPacientes from '../layout/GestorPacientes/BodyGestorPacientes';

export default function GestorPacientes() {
  const { autenticado, gestor } = useAuthGestor({ proteger: true });

  if (autenticado === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#3b6bc8' }}>
        Verificando sessão...
      </div>
    );
  }

  return (
    <div className="gestor-page">
      <GestorHeader nome={gestor?.nome} sobrenome={gestor?.sobrenome} />
      <BodyGestorPacientes />
    </div>
  );
}
