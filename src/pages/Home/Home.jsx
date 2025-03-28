import React, { useContext } from 'react';
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

  const voltarInicio = () => {
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="header">
        <button className="botao-voltar" onClick={voltarInicio}>
          <span className="botao-voltar-icon">←</span> Voltar
        </button>
        <h1>Roleta de Reflexões</h1>
      </div>
      
      <div className={`jogo-area ${cartaSelecionada ? 'has-result' : ''}`}>
        <div className="controles-area">
          <SeletorCategoria />
          
          <Roleta girar={girar} angulo={angulo} />
          
          <Botao 
            texto={girar ? 'Girando...' : 'Girar Roleta'} 
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