import { useState, useContext } from 'react';
import { MensagensContext } from '../context/MensagensContext';

export const useRoleta = () => {
  const [girar, setGirar] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const { selecionarCartaAleatoria } = useContext(MensagensContext);

  const girarRoleta = () => {
    if (!girar) {
      // Limpa carta atual
      const novoAngulo = angulo + 1080 + Math.floor(Math.random() * 720);
      setAngulo(novoAngulo);
      setGirar(true);
      
      // Após a animação, seleciona uma carta aleatória
      setTimeout(() => {
        selecionarCartaAleatoria();
        setGirar(false);
      }, 3000);
      
      // Adicione um log para debug
      console.log('Roleta girando, carta será selecionada em 3 segundos');
    }
  };

  return { girar, angulo, girarRoleta };
};