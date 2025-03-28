import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

const Inicio = () => {
  const navigate = useNavigate();

  const iniciarJogo = () => {
    navigate('/jogo');
  };

  return (
    <div className="inicio-container">
      <div className="inicio-content">
        <div className="logo-container">
          <div className="logo-circle">
            <div className="logo-inner">
              <span>Reflexões</span>
            </div>
          </div>
        </div>
        
        <h1 className="inicio-title">Roleta de Reflexões</h1>
        
        <p className="inicio-description">
          Um jogo para fortalecer os laços familiares e promover momentos 
          especiais de conexão através de perguntas e reflexões.
        </p>
        
        <div className="categorias-preview">
          <div className="categoria-item">Família</div>
          <div className="categoria-item">Crianças</div>
          <div className="categoria-item">Valores</div>
        </div>
        
        <div className="como-jogar">
          <h2>Como Jogar</h2>
          <ol>
            <li>Escolha uma categoria de perguntas</li>
            <li>Gire a roleta e aguarde ela parar</li>
            <li>Reflita e discuta sobre a pergunta selecionada</li>
            <li>Compartilhe seus pensamentos com a família</li>
          </ol>
        </div>
        
        <button onClick={iniciarJogo} className="botao-iniciar">
          Começar a Jogar
        </button>
      </div>
      
      <div className="decoracao-bolhas">
        <div className="bolha bolha1"></div>
        <div className="bolha bolha2"></div>
        <div className="bolha bolha3"></div>
        <div className="bolha bolha4"></div>
      </div>
    </div>
  );
};

export default Inicio;