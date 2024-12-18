import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Footer from "../components/Rodape.js"; // Importar o rodapé reutilizável
import "../css/Layout.css"; // Estilos gerais
import "../css/Rodape.css"; // Estilos do rodapé

const Layout = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    // Carregar as configurações do sistema
    axios.get("/api/config/system-config/").then((response) => {
      setConfig(response.data);

      // Atualizar o favicon
      if (response.data.favicon) {
        let favicon = document.getElementById("favicon");
        if (!favicon) {
          favicon = document.createElement("link");
          favicon.id = "favicon";
          favicon.rel = "icon";
          document.head.appendChild(favicon);
        }
        favicon.href = response.data.favicon;
      }
    });
  }, []);

  return (
    <div
      className="layout-container"
      style={{
        backgroundImage: config.background_image
          ? `url(${config.background_image})`
          : "linear-gradient(120deg, #1d2671, #37c3ac)",
      }}
    >
      <header className="layout-header">
        {config.logo && <img src={config.logo} alt="Logo" className="layout-logo" />}
      </header>
      <main className="layout-content">
        <Outlet /> {/* Renderiza as rotas filhas */}
      </main>
      <Footer /> {/* Inclui o rodapé globalmente */}
    </div>
  );
};

export default Layout;
