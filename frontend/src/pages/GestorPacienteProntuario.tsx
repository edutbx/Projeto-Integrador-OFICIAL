import React from 'react';
import { useAuthGestor } from '../hooks/useAuthGestor';
import GestorHeader from '../componets/GestorHeader/GestorHeader';
import BodyGestorPacienteProntuario from '../layout/GestorPacienteProntuario/BodyGestorPacienteProntuario';

export default function GestorPacienteProntuario() {
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
      <BodyGestorPacienteProntuario />
    </div>
  );
}
