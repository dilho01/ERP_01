import React, { useState } from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tabela1'); // Controle do tipo de tabela selecionado
  const [activeSection, setActiveSection] = useState(null); // Controle da seção ativa (exemplo: 'cadastro')

  const renderTableDetails = () => {
    if (activeSection === 'cadastro') {
      return (
        <div className="section-content">
          <div className="section-group">
            <h2>📦 PRODUTOS</h2>
            <div className="section-items">
              <button>Catálogo</button>
              <button>Cadastro</button>
              <button>Grupos e Subgrupos</button>
            </div>
          </div>
          <div className="section-group">
            <h2>🗂️ ADMINISTRATIVO</h2>
            <div className="section-items">
              <button>Serviços</button>
              <button>Clientes</button>
              <button>Fornecedores</button>
              <button>Contratos</button>
              <button>Ativos</button>
            </div>
          </div>
          <div className="section-group">
            <h2>👥 RECURSOS HUMANOS</h2>
            <div className="section-items">
              <button>Funcionários</button>
              <button>Estrutura de RH</button>
            </div>
          </div>
          <div className="section-group">
            <h2>💰 FINANCEIRO</h2>
            <div className="section-items">
              <button>Caixas e Contas</button>
              <button>Plano de Contas</button>
              <button>Centro de Custos</button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'tabela1':
        return <div>Detalhes da Tabela 1</div>;
      case 'tabela2':
        return <div>Detalhes da Tabela 2</div>;
      case 'tabela3':
        return <div>Detalhes da Tabela 3</div>;
      default:
        return <div>Selecione um tipo de tabela.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Barra de Navegação */}
      <nav className="navbar">
        <ul className="nav-tabs">
          <li className="nav-item" onClick={() => setActiveSection('configuracoes')}>
            Configurações Gerais
          </li>
          <li className="nav-item" onClick={() => setActiveSection('cadastro')}>
            Cadastros
          </li>
          <li className="nav-item" onClick={() => setActiveSection('comercial')}>
            Comercial
          </li>
          <li className="nav-item" onClick={() => setActiveSection('financeiro')}>
            Financeiro
          </li>
          <li className="nav-item" onClick={() => setActiveSection('servicos')}>
            Serviços
          </li>
          <li className="nav-item" onClick={() => setActiveSection('relatorios')}>
            Relatórios
          </li>
        </ul>
      </nav>

      {/* Tipos de Tabelas */}
      {activeSection === null && (
        <div className="table-types">
          <button
            className={`table-btn ${activeTab === 'tabela1' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabela1')}
          >
            Tabela 1
          </button>
          <button
            className={`table-btn ${activeTab === 'tabela2' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabela2')}
          >
            Tabela 2
          </button>
          <button
            className={`table-btn ${activeTab === 'tabela3' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabela3')}
          >
            Tabela 3
          </button>
        </div>
      )}

      {/* Quadro Central */}
      <div className="dashboard-box">{renderTableDetails()}</div>
    </div>
  );
};

export default Dashboard;
