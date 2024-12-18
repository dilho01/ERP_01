import React, { useState } from 'react';
import axios from 'axios';
import "../css/ErpCadastroUser.css"

const ErpCadastroUser = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    nivel_acesso: '',
    status: 'Ativo',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/usuarios/', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        nivel_acesso: formData.nivel_acesso,
        status: formData.status,
      });
      setMessage('Usuário cadastrado com sucesso!');
      setFormData({
        nome: '',
        email: '',
        senha: '',
        nivel_acesso: '',
        status: 'Ativo',
      });
    } catch (error) {
      console.error(error);  // Verificar o erro detalhado
      setMessage('Erro ao cadastrar o usuário. Verifique os dados.');
    }
  };
  
  return (
<div class="form-container">
  <h1>Cadastro de Usuário</h1>
  {message && <p class="message">{message}</p>}
  <form onSubmit={handleSubmit}>
    <div class="form-group">
      <label>Nome:</label>
      <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} required />
    </div>
    <div class="form-group">
      <label>Senha:</label>
      <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
    </div>
    <div class="form-group">
      <label>Nível de Acesso:</label>
      <input type="number" name="nivel_acesso" value={formData.nivel_acesso} onChange={handleChange} required />
    </div>
    <button type="submit" class="btn-submit">Cadastrar</button>
  </form>
</div>
  );
};

export default ErpCadastroUser;
