import React, { useState, useEffect } from 'react';
import audioService from '../../services/AudioService';
import './MusicaControle.css';

const MusicaControle = ({ musicaSrc = '/musicas/relaxing-background.mp3' }) => {
  const [tocando, setTocando] = useState(false);

  // Inicializar o serviço de áudio e sincronizar estado
  useEffect(() => {
    // Verificar estado atual em vez de reinicializar
    if (!audioService.initialized) {
      try {
        audioService.init(musicaSrc);
      } catch (error) {
        console.error('Erro ao inicializar áudio:', error);
      }
    }
    
    // Importante: Sincronizar estado inicial com o serviço
    const estadoInicial = audioService.isPlaying();
    setTocando(estadoInicial);
    console.log('Estado inicial do áudio:', estadoInicial);
    
    // Escutar mudanças de estado do áudio
    const handleAudioChange = (event) => {
      if (event.detail && typeof event.detail.isPlaying === 'boolean') {
        console.log('Evento de mudança de áudio recebido:', event.detail.isPlaying);
        setTocando(event.detail.isPlaying);
      }
    };
    
    document.addEventListener('audioStateChange', handleAudioChange);
    
    return () => {
      document.removeEventListener('audioStateChange', handleAudioChange);
    };
  }, [musicaSrc]);

  // Alternar entre tocar e pausar a música
  const toggleMusica = () => {
    try {
      const novoEstado = audioService.toggle();
      console.log('Toggle de música: novo estado =', novoEstado);
      setTocando(novoEstado);
      
      // Armazenar estado no localStorage para persistência
      localStorage.setItem('musicaAtiva', novoEstado.toString());
      
      // Disparar evento para outros componentes que possam estar escutando
      const event = new CustomEvent('audioStateChange', { 
        detail: { isPlaying: novoEstado } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Erro ao alternar música:', error);
    }
  };

  return (
    <button 
      className={`musica-controle ${tocando ? 'tocando' : 'pausado'}`}
      onClick={toggleMusica}
      aria-label={tocando ? 'Pausar música' : 'Tocar música'}
      title={tocando ? 'Pausar música' : 'Tocar música'}
    >
      {tocando ? (
        <span className="musica-icon tocando" role="img" aria-label="Música tocando">
          🔊
        </span>
      ) : (
        <span className="musica-icon pausado" role="img" aria-label="Música pausada">
          🔇
        </span>
      )}
    </button>
  );
};

export default MusicaControle;