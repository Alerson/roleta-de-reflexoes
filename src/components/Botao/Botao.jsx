import React, { memo } from 'react';
import './Botao.css';

// Usando memo para evitar re-renders desnecessários
const Botao = memo(({ texto, onClick, disabled }) => {
  // Função que previne múltiplos cliques
  const handleClick = (e) => {
    if (disabled) return;
    onClick(e);
  };

  return (
    <button 
      className="botao"
      onClick={handleClick}
      disabled={disabled}
    >
      {texto}
    </button>
  );
});

export default Botao;