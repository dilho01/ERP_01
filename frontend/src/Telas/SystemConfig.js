import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Layout.css"; // Arquivo CSS para estilização


function SystemConfig() {
  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [currentConfig, setCurrentConfig] = useState({});

  // Carregar as configurações atuais
  useEffect(() => {
    axios
      .get("/api/config/system-config/")
      .then((response) => setCurrentConfig(response.data))
      .catch((err) => console.error("Erro ao carregar configurações:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (logo) formData.append("logo", logo);
    if (background) formData.append("background_image", background);
    if (favicon) formData.append("favicon", favicon);

    try {
      const response = await axios.post("/api/config/system-config/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Configurações atualizadas com sucesso!");
      setCurrentConfig(response.data);
      window.location.reload(); // Recarregar a página
    } catch (err) {
      alert("Erro ao salvar configurações.");
      console.error(err);
    }
  };

  const handleRemove = async (field) => {
    try {
      await axios.delete("/api/config/system-config/remove", { data: { field } });
      alert(`${field} removido com sucesso!`);
      setCurrentConfig((prev) => ({ ...prev, [field]: null }));
    } catch (err) {
      alert("Erro ao remover configuração.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="background-overlay"></div>
      <div className="box">
        <h2>Configurações do Sistema</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Logo:</label>
            {currentConfig.logo ? (
              <div>
                <img src={currentConfig.logo} alt="Logo Atual" style={{ maxHeight: "90px", marginBottom: "10px" }} />
                <button type="button" className="remove-button" onClick={() => handleRemove("logo")}>
                  Remover
                </button>
              </div>
            ) : (
              <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
            )}
          </div>
          <div className="form-group">
            <label>Imagem de Fundo:</label>
            {currentConfig.background_image ? (
              <div>
                <img
                  src={currentConfig.background_image}
                  alt="Fundo Atual"
                  style={{ maxHeight: "90px", marginBottom: "10px" }}
                />
                <button type="button" className="remove-button" onClick={() => handleRemove("background_image")}>
                  Remover
                </button>
              </div>
            ) : (
              <input type="file" onChange={(e) => setBackground(e.target.files[0])} />
            )}
          </div>
          <div className="form-group">
            <label>Favicon:</label>
            {currentConfig.favicon ? (
              <div>
                <img
                  src={currentConfig.favicon}
                  alt="Favicon Atual"
                  style={{ maxHeight: "90px", marginBottom: "10px" }}
                />
                <button type="button" className="remove-button" onClick={() => handleRemove("favicon")}>
                  Remover
                </button>
              </div>
            ) : (
              <input type="file" onChange={(e) => setFavicon(e.target.files[0])} />
            )}
          </div>
          <button type="submit" className="button">
            Salvar Configurações
          </button>
        </form>
      </div>
    
    </div>
  );
}

export default SystemConfig;
