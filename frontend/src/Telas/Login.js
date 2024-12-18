import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para redirecionar após login
import axios from "axios";
import "../css/Layout.css"; // Arquivo CSS para estilização

function Login() {
  const [username, setUsername] = useState(""); // Armazena o email
  const [password, setPassword] = useState(""); // Armazena a senha
  const [error, setError] = useState(""); // Mensagem de erro
  const [logo, setLogo] = useState(null); // Configuração do logo
  const navigate = useNavigate(); // Inicializa o redirecionamento

  // Buscar a configuração do logo ao carregar o componente
  useEffect(() => {
    let isMounted = true; // Previne atualizações em componentes desmontados
    axios
      .get("/api/config/system-config/")
      .then((response) => {
        if (isMounted && response.data.logo) {
          setLogo(response.data.logo); // Atualiza a URL do logo
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar configurações do sistema:", err);
      });
    return () => {
      isMounted = false; // Limpa a montagem ao sair
    };
  }, []);

  // Função de login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/config/login/", {
        email: username, // Altere para "email" (backend espera esse campo)
        senha: password, // Altere para "senha" (backend espera esse campo)
      });

      if (response.data.access) {
        // Salva os tokens no localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        // Alerta opcional de sucesso e redirecionamento para o Dashboard
        alert(response.data.message);
        navigate("/dashboard"); // Redireciona para o Dashboard
      } else {
        setError("Erro ao autenticar. Verifique suas credenciais.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao autenticar.");
    }
  };

  return (
    <div className={`container ${logo ? "has-logo" : "no-logo"}`}>
      <div className="background-overlay"></div>
      <div className="box">
      
        <p>Faça login para continuar</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">
            Entrar
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
