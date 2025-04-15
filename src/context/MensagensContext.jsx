import React, { createContext, useState, useCallback, useMemo } from 'react';
import { mensagens } from '../data/mensagens';

export const MensagensContext = createContext();

export const MensagensProvider = ({ children }) => {
  const [categoriaAtual, setCategoriaAtual] = useState('familia');
  const [cartaSelecionada, setCartaSelecionada] = useState(null);
  
  // Usando useMemo para calcular o array de mensagens da categoria atual
  // apenas quando a categoria muda, não em todos os renders
  const mensagensDaCategoria = useMemo(() => {
    return mensagens[categoriaAtual] || [];
  }, [categoriaAtual]);

  // Otimizando a função de seleção com useCallback para evitar recriações
  const selecionarCategoria = useCallback((categoria) => {
    if (categoria !== categoriaAtual) {
      setCategoriaAtual(categoria);
      // Reset da carta selecionada ao mudar de categoria
      setCartaSelecionada(null);
    }
  }, [categoriaAtual]);

  // Otimizando a função de seleção aleatória com useCallback
  const selecionarCartaAleatoria = useCallback(() => {
    const mensagensDisponiveis = mensagens[categoriaAtual];
    if (!mensagensDisponiveis || mensagensDisponiveis.length === 0) {
      console.error(`Não há mensagens disponíveis para a categoria: ${categoriaAtual}`);
      return;
    }
    
    // Usando uma operação mais direta para selecionar um índice aleatório
    const indiceAleatorio = Math.floor(Math.random() * mensagensDisponiveis.length);
    const novaMensagem = mensagensDisponiveis[indiceAleatorio];
    
    // Verificação para não repetir a mesma mensagem
    if (novaMensagem === cartaSelecionada && mensagensDisponiveis.length > 1) {
      // Tenta novamente para evitar repetição
      selecionarCartaAleatoria();
    } else {
      setCartaSelecionada(novaMensagem);
    }
  }, [categoriaAtual, cartaSelecionada]);
  
  const limparCartaSelecionada = useCallback(() => {
    setCartaSelecionada(null);
  }, []);

  // Memoizando o valor do contexto para evitar recriações desnecessárias
  const contextValue = useMemo(() => ({
    mensagens,
    categoriaAtual,
    cartaSelecionada,
    mensagensDaCategoria, // Adicionado para facilitar acesso
    selecionarCategoria,
    selecionarCartaAleatoria,
    limparCartaSelecionada
  }), [
    categoriaAtual,
    cartaSelecionada,
    mensagensDaCategoria,
    selecionarCategoria,
    selecionarCartaAleatoria,
    limparCartaSelecionada
  ]);

  return (
    <MensagensContext.Provider value={contextValue}>
      {children}
    </MensagensContext.Provider>
  );
};