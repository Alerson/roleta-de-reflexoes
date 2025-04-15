import React, { useEffect, useState, useContext } from 'react';
import { MensagensContext } from '../../context/MensagensContext';
import './CartaReflexao.css';

const CartaReflexao = ({ mensagem }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { categoriaAtual } = useContext(MensagensContext);
  
  // Determinar o título com base na categoria atual
  const getTitulo = () => {
    if (categoriaAtual === 'motivacao') {
      return "Mensagem motivacional";
    }
    return "Reflexão";
  };
  
  // Efeito para ativar a animação quando o componente é montado
  useEffect(() => {
    // Pequeno delay para garantir que a animação ocorra após a roleta parar
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Log para debug
    console.log('CartaReflexao recebeu mensagem:', mensagem);
    
    return () => clearTimeout(timer);
  }, [mensagem]);

  return (
    <div className="carta-container">
      {isVisible && <div className="brilho"></div>}
      <div className="carta-reflexao">
        <h2>{getTitulo()}</h2>
        <p>{mensagem}</p>
      </div>
    </div>
  );
};

export default CartaReflexao;