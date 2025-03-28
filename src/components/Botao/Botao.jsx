import React from 'react';
import './Botao.css';

const Botao = ({ texto, onClick, disabled }) => {
  return (
    <button 
      className="botao"
      onClick={onClick}
      disabled={disabled}
    >
      {texto}
    </button>
  );
};

export default Botao;