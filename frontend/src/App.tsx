import React from 'react';
import Home from './pages/Home';
import SobreNos from './pages/SobreNos';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Medico from './pages/Medico';
import NovaConsulta from './pages/NovaConsulta';
import Prontuario from './pages/Prontuario';
import Gestor from './pages/Gestor';

// Roteamento simples por pathname — mesma lógica anterior
const ROUTES: Record<string, React.FC> = {
  '/':             Home,
  '/sobreNos':     SobreNos,
  '/login':        Login,
  '/cadastro':     Cadastro,
  '/medico':       Medico,
  '/novaConsulta': NovaConsulta,
  '/prontuario':   Prontuario,
  '/gestor':       Gestor,
};

const App: React.FC = () => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const Page = ROUTES[path] || Home;
  return <Page />;
};

export default App;
