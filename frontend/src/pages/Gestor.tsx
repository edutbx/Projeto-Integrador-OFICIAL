import React from 'react';
import { useAuth } from '../hooks/useAuth';
import DoctorHeader from '../componets/DoctorHeader/DoctorHeader';
import BodyGestor from '../layout/Gestor/BodyGestor';

export default function Gestor() {
  const { autenticado, usuario } = useAuth({ proteger: true });
  if (autenticado === null) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontSize:'1.2rem', color:'#3b6bc8' }}>
      Verificando sessão...
    </div>
  );
  return (
    <div className="gestor-page">
      <DoctorHeader nome={usuario?.nome} crm={usuario?.crm} especializacao="Gestor" />
      <BodyGestor />
    </div>
  );
}
