import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PermissoesUsuario = () => {
  const { usuario_id } = useParams();
  const [usuario, setUsuario] = useState({});
  const [permissoes, setPermissoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/usuarios/${usuario_id}/permissoes/`)
      .then((response) => response.json())
      .then((data) => {
        setUsuario(data.usuario);
        setPermissoes(data.todos_niveis);
        setSelecionadas(data.niveis_usuario);
      })
      .catch((error) => console.error("Erro ao carregar permissões:", error));
  }, [usuario_id]);

  const handleCheckboxChange = (nivel_id) => {
    setSelecionadas((prev) =>
      prev.includes(nivel_id)
        ? prev.filter((id) => id !== nivel_id)
        : [...prev, nivel_id]
    );
  };

  const handleSave = () => {
    fetch(`/usuarios/${usuario_id}/salvar/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niveis_acesso: selecionadas }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        navigate("/"); // Redireciona para a lista de usuários
      })
      .catch((error) => console.error("Erro ao salvar permissões:", error));
  };

  return (
    <div>
      <h1>Permissões do Usuário - {usuario.nome}</h1>
      <div>
        {permissoes.map((nivel) => (
          <div key={nivel.id}>
            <label>
              <input
                type="checkbox"
                checked={selecionadas.includes(nivel.id)}
                onChange={() => handleCheckboxChange(nivel.id)}
              />
              {nivel.descricao}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Salvar Permissões</button>
      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
};

export default PermissoesUsuario;
