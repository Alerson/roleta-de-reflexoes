import React, { useContext } from 'react';
import './SeletorCategoria.css';
import { MensagensContext } from '../../context/MensagensContext';

const SeletorCategoria = () => {
  const { categoriaAtual, selecionarCategoria } = useContext(MensagensContext);

  // Definindo os ícones (emojis) para cada categoria
  const icones = {
    familia: '👨‍👩‍👧‍👦',
    criancas: '👶',
    valores: '🧠',
    motivacao: '✨'
  };

  return (
    <div className="seletor-categoria">
      <button 
        className={`categoria-botao ${categoriaAtual === 'familia' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('familia')}
      >
        <span className="icone-categoria">{icones.familia}</span> Família
      </button>
      <button 
        className={`categoria-botao ${categoriaAtual === 'criancas' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('criancas')}
      >
        <span className="icone-categoria">{icones.criancas}</span> Crianças
      </button>
      <button 
        className={`categoria-botao ${categoriaAtual === 'valores' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('valores')}
      >
        <span className="icone-categoria">{icones.valores}</span> Valores
      </button>
      <button 
        className={`categoria-botao ${categoriaAtual === 'motivacao' ? 'ativo' : ''}`}
        onClick={() => selecionarCategoria('motivacao')}
      >
        <span className="icone-categoria">{icones.motivacao}</span> Motivação
      </button>
    </div>
  );
};

export default SeletorCategoria;