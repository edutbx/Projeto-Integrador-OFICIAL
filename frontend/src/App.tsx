import React from 'react';
import Home from './pages/Home';
import SobreNos from './pages/SobreNos';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Medico from './pages/Medico';
import NovaConsulta from './pages/NovaConsulta';
import Prontuario from './pages/Prontuario';
import Gestor from './pages/Gestor';
import GestorMedicos from './pages/GestorMedicos';
import Servicos from './pages/Servicos';
import Contato from './pages/Contato';
import Entrar from './pages/Entrar';
import LoginGestor from './pages/LoginGestor';

// Roteamento simples por pathname — mesma lógica anterior
const ROUTES: Record<string, React.FC> = {
  '/':                Home,
  '/sobreNos':        SobreNos,
  '/servicos':        Servicos,
  '/contato':         Contato,
  '/entrar':          Entrar,
  '/login':           Login,
  '/login-gestor':    LoginGestor,
  '/cadastro':        Cadastro,
  '/medico':          Medico,
  '/novaConsulta':    NovaConsulta,
  '/prontuario':      Prontuario,
  '/gestor':          Gestor,
  '/gestor/medicos':  GestorMedicos,
};

const App: React.FC = () => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const Page = ROUTES[path] || Home;
  return <Page />;
};

export default App;
