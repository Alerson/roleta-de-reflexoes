import { useState, useContext, useRef, useEffect } from 'react';
import { MensagensContext } from '../context/MensagensContext';

export const useRoleta = () => {
  const [girar, setGirar] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const { selecionarCartaAleatoria } = useContext(MensagensContext);
  const timerRef = useRef(null);

  const girarRoleta = () => {
    if (!girar) {
      // Limpar qualquer timer pendente
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Gerar novo ângulo aleatório
      const novoAngulo = angulo + 1080 + Math.floor(Math.random() * 720);
      setAngulo(novoAngulo);
      setGirar(true);
      
      // Após a animação, seleciona uma carta aleatória
      timerRef.current = setTimeout(() => {
        try {
          selecionarCartaAleatoria();
        } catch (error) {
          console.error("Erro ao selecionar carta aleatória:", error);
        } finally {
          setGirar(false);
          timerRef.current = null;
        }
      }, 3000);
      
      console.log('Roleta girando, carta será selecionada em 3 segundos');
    }
  };

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { girar, angulo, girarRoleta };
};