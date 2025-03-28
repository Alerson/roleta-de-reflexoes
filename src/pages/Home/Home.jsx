import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Roleta from '../../components/Roleta';
import SeletorCategoria from '../../components/SeletorCategoria';
import CartaReflexao from '../../components/CartaReflexao';
import Botao from '../../components/Botao';
import { useRoleta } from '../../hooks/useRoleta';
import { MensagensContext } from '../../context/MensagensContext';
import './Home.css';

const Home = () => {
  const { girar, angulo, girarRoleta } = useRoleta();
  const { cartaSelecionada } = useContext(MensagensContext);
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);

  // Carregar dados do jogador
  useEffect(() => {
    // Verificar se há um jogador atual
    const player = localStorage.getItem('currentPlayer');
    
    if (player) {
      setCurrentPlayer(JSON.parse(player));
    } else {
      // Redirecionar para a tela inicial se não tiver jogador
      navigate('/');
      return;
    }
  }, [navigate]);

  const voltarInicio = () => {
    navigate('/');
  };

  return (
    <div className="home-container">
      <h1 className="app-title">Roleta de Reflexões</h1>
      
      <div className="nav-container">
        <button className="botao-voltar" onClick={voltarInicio}>
          <span className="botao-voltar-icon">←</span> Voltar
        </button>
        
        {currentPlayer && (
          <div className="player-info">
            <div className={`avatar avatar-${currentPlayer.avatar || 1}`}></div>
            <span className="player-name">{currentPlayer.name}</span>
          </div>
        )}
      </div>
      
      <div className={`jogo-area ${cartaSelecionada ? 'has-result' : ''}`}>
        <div className="controles-area">
          <SeletorCategoria />
          
          <Roleta girar={girar} angulo={angulo} />
          
          <Botao 
            texto="Girar Roleta" 
            onClick={girarRoleta} 
            disabled={girar} 
          />
        </div>
        
        {cartaSelecionada && (
          <div className="resultado-area">
            <CartaReflexao mensagem={cartaSelecionada} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;