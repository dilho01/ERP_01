import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaCog, FaFileAlt, FaLock, FaMoon, FaSun } from 'react-icons/fa';
import '../css/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Tema padrão: escuro
  const location = useLocation();

  // Não exibir a barra na tela de login
  if (location.pathname === '/') return null;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''} ${isDarkTheme ? 'dark' : 'light'}`}>
        <div className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>
        <ul>
          <li>
            <Link to="/Dashboard">
              <FaHome /> <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/config">
              <FaCog /> <span>Configuração de Temas</span>
            </Link>
          </li>
          <li>
            <Link to="/logs">
              <FaFileAlt /> <span>Logs</span>
            </Link>
          </li>
          <li>
            <Link to="/permissoes">
              <FaLock /> <span>Permissões</span>
            </Link>
          </li>
        </ul>
        <div className="theme-toggle" onClick={toggleTheme}>
          {isDarkTheme ? <FaSun size={24} /> : <FaMoon size={24} />}
          <span>{isDarkTheme ? 'Claro' : 'Escuro'}</span>
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
