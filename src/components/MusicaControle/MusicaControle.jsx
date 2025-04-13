import React, { useState, useEffect } from 'react';
import audioService from '../../services/AudioService';
import './MusicaControle.css';

const MusicaControle = ({ musicaSrc = '/musicas/relaxing-background.mp3' }) => {
  const [tocando, setTocando] = useState(false);

  // Inicializar o serviço de áudio
  useEffect(() => {
    audioService.init(musicaSrc);
    setTocando(audioService.isPlaying());
    
    // Escutar mudanças de estado do áudio
    const handleAudioChange = (event) => {
      if (event.detail && typeof event.detail.isPlaying === 'boolean') {
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
    const novoEstado = audioService.toggle();
    setTocando(novoEstado);
    
    // Disparar evento para outros componentes que possam estar escutando
    const event = new CustomEvent('audioStateChange', { 
      detail: { isPlaying: novoEstado } 
    });
    document.dispatchEvent(event);
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