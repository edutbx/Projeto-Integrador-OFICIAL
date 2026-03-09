import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../componets/DoctorHeader/DoctorHeader';
import BodyProntuario from '../layout/Prontuario/BodyProntuario';

export default function Prontuario() {
  const { autenticado, usuario } = useAuth({ proteger: true });
  if (autenticado === null) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'1.2rem', color:'#3b6bc8' }}>
      Verificando sessão...
    </div>
  );
  return (
    <div className="pront-page">
      <DoctorHeader nome={usuario?.nome} crm={usuario?.crm} especializacao={usuario?.especializacao} />
      <BodyProntuario />
    </div>
  );
}
