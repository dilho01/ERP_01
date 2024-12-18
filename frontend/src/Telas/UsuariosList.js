import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8000/usuarios/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUsuarios(data))
      .catch((error) => {
        console.error("Erro ao carregar usuários:", error);
        setError("Erro ao carregar usuários.");
      });
  }, []);
  

  const handlePermissao = (id) => {
    navigate(`/usuarios/${id}/permissoes`);
  };

  return (
    <div>
      <h1>Usuários Cadastrados</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => handlePermissao(user.id)}>
                    🗝️ Editar Permissões
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsuariosList;
