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
          ← Voltar
        </button>
        <h1>Roleta de Reflexões</h1>
      </div>
      
      <SeletorCategoria />
      
      <Roleta girar={girar} angulo={angulo} />
      
      <Botao 
        texto={girar ? 'Girando...' : 'Girar Roleta'} 
        onClick={girarRoleta} 
        disabled={girar} 
      />
      
      {cartaSelecionada && (
        <CartaReflexao mensagem={cartaSelecionada} />
      )}
    </div>
  );
};

export default Home;