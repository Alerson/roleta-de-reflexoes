import React, { createContext, useState } from 'react';
import { mensagens } from '../data/mensagens';

export const MensagensContext = createContext();

export const MensagensProvider = ({ children }) => {
  const [categoriaAtual, setCategoriaAtual] = useState('familia');
  const [cartaSelecionada, setCartaSelecionada] = useState(null);

  const selecionarCategoria = (categoria) => {
    setCategoriaAtual(categoria);
    setCartaSelecionada(null);
  };

  const selecionarCartaAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * mensagens[categoriaAtual].length);
    setCartaSelecionada(mensagens[categoriaAtual][indiceAleatorio]);
  };

  return (
    <MensagensContext.Provider 
      value={{ 
        mensagens, 
        categoriaAtual, 
        cartaSelecionada, 
        selecionarCategoria, 
        selecionarCartaAleatoria 
      }}
    >
      {children}
    </MensagensContext.Provider>
  );
};