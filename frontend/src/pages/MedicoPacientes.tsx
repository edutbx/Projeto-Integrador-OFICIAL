import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../componets/DoctorHeader/DoctorHeader';
import BodyMedicoPacientes from '../layout/MedicoPacientes/BodyMedicoPacientes';

export default function MedicoPacientes() {
  const { autenticado, usuario } = useAuth({ proteger: true });

  if (autenticado === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#3b6bc8' }}>
        Verificando sessão...
      </div>
    );
  }

  return (
    <div className="med-page">
      <DoctorHeader
        nome={usuario?.nome}
        sobrenome={usuario?.sobrenome}
        crm={usuario?.crm}
        especializacao={usuario?.especializacao}
      />
      <BodyMedicoPacientes />
    </div>
  );
}
