import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Layout.css"; // Arquivo CSS para estilização

function RecuperacaoSenha() {
  const [step, setStep] = useState(1); // Controla as etapas
  const [email, setEmail] = useState(""); // Armazena o e-mail
  const [codigo, setCodigo] = useState(""); // Armazena o código de recuperação
  const [novaSenha, setNovaSenha] = useState(""); // Armazena a nova senha
  const [message, setMessage] = useState(""); // Mensagens de sucesso ou informação
  const [error, setError] = useState(""); // Mensagens de erro
  const [logo, setLogo] = useState(null); // Adicionando o estado logo

  useEffect(() => {
    // Carregar a configuração do logo (se necessário)
    axios
      .get("http://localhost:8000/api/config/system-config/")
      .then((response) => {
        if (response.data.logo) {
          setLogo(response.data.logo); // Atualiza o estado do logo
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar o logo:", error);
      });
  }, []);

  // Função para enviar o e-mail e gerar código de recuperação
  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/api/config/recuperar-senha/", { email });
      setMessage(response.data.message);
      setStep(2); // Avança para a próxima etapa
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao enviar o código.");
    }
  };

  // Função para validar o código de recuperação
  const handleValidarCodigo = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/api/config/validar-codigo/", { email, codigo });
      setMessage(response.data.message);
      setStep(3); // Avança para a etapa de redefinir senha
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao validar o código.");
    }
  };

  // Função para redefinir a senha
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/api/config/redefinir-senha/", {
        email,
        codigo, // Inclua o código de recuperação
        nova_senha: novaSenha,
      });
      setMessage(response.data.message);
      setStep(4); // Finaliza o processo
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao redefinir a senha.");
    }
  };

  return (
    <div className={`container ${logo ? "has-logo" : "no-logo"}`}>
      <div className="background-overlay"></div>
      <div className="box">
        <h2>Recuperação de Senha</h2>

        {/* Etapa 1: Inserir e-mail */}
        {step === 1 && (
          <form onSubmit={handleEnviarEmail}>
             <div className="form-group">
                <label>Email:</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <button type="submit">Enviar Código</button>
          </form>
        )}

        {/* Etapa 2: Inserir código de recuperação */}
        {step === 2 && (
          <form onSubmit={handleValidarCodigo}>
             <div className="form-group">
                <label>Código de Recuperação:</label>
                <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                />
            </div>
            <button type="submit">Validar Código</button>
          </form>
        )}

        {/* Etapa 3: Redefinir senha */}
        {step === 3 && (
          <form onSubmit={handleRedefinirSenha}>
            <div className="form-group">
                <label>Nova Senha:</label>
                <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                />
            </div>
            <button type="submit">Redefinir Senha</button>
          </form>
        )}

        {/* Etapa 4: Processo concluído */}
        {step === 4 && <p>Sua senha foi redefinida com sucesso! Você pode agora fazer login.</p>}

        {/* Mensagens de sucesso ou erro */}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default RecuperacaoSenha;
