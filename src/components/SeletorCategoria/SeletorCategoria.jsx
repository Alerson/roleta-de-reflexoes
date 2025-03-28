import React, { useContext } from 'react';
import './SeletorCategoria.css';
import { MensagensContext } from '../../context/MensagensContext';

const SeletorCategoria = () => {
  const { categoriaAtual, selecionarCategoria } = useContext(MensagensContext);

  return (
    <div className="seletor-categoria">
      <button 
        className={`categoria-botao ${categoriaAtual === 'familia' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('familia')}
      >
        Família
      </button>
      <button 
        className={`categoria-botao ${categoriaAtual === 'criancas' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('criancas')}
      >
        Crianças
      </button>
      <button 
        className={`categoria-botao ${categoriaAtual === 'valores' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('valores')}
      >
        Valores
      </button>
    </div>
  );
};

export default SeletorCategoria;