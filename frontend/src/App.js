import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Rodape"; 
import Layout from "./components/Layout";
import SystemConfig from "./Telas/SystemConfig";
import Login from "./Telas/Login";
import Dashboard from './Telas/Dashboard';
import Sidebar from './components/Sidebar';
import Erp_CadastroUser from './Telas/erp_CadastroUser';
import RedefinirSenha from "./Telas/RedefinirSenha";
import PermissoesUsuario from './Telas/PermissoesUsuario';
import UsuariosList from './Telas/UsuariosList';

function App() {
  return (
    <Router>
      <Sidebar /> 
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} /> {/* Define a tela de Login como principal */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/config" element={<SystemConfig />} />
          <Route path="/cadastrar_usuario" element={<Erp_CadastroUser />} />
          <Route path="/redefinir_senha" element={<RedefinirSenha />} />
          <Route path="/usuarios" element={<UsuariosList />} />
          <Route path="/usuarios/:usuario_id/permissoes" element={<PermissoesUsuario />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
