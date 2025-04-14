import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MensagensProvider } from './context/MensagensContext';
import Home from './pages/Home/Home';
import TelaInicial from './pages/TelaInicial/TelaInicial';
import ConsentimentoPrivacidade from './components/ConsentimentoPrivacidade/ConsentimentoPrivacidade';
import audioService from './services/AudioService';
import './styles/global.css';

// Verificação condicional para capacitor
const CapApp = typeof window !== 'undefined' && window.Capacitor ? 
  window.Capacitor.Plugins.App : null;

function App() {
  const [consentimentoRealizado, setConsentimentoRealizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Verificar se o usuário já deu consentimento e inicializar serviços
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar consentimento
        const privacyConsent = localStorage.getItem('privacyConsent');
        if (privacyConsent === 'true') {
          setConsentimentoRealizado(true);
        }
        
        // Inicializar serviço de áudio após um atraso para garantir que a interface esteja carregada
        setTimeout(() => {
          audioService.init();
        }, 500);
        
        // Adicione escuta para eventos de ciclo de vida apenas se o Capacitor estiver disponível
        if (CapApp) {
          CapApp.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
              // App voltou ao primeiro plano
              if (audioService.musicaAtiva) {
                audioService.play();
              }
            } else {
              // App foi para o background
              // Opcionalmente pausa o áudio aqui, dependendo do comportamento desejado
              // audioService.pause();
            }
          });
        }
      } catch (error) {
        console.error("Erro na inicialização do app:", error);
      } finally {
        setCarregando(false);
      }
    };
  
    initializeApp();
    
    return () => {
      // Remover listeners apenas se o Capacitor estiver disponível
      if (CapApp) {
        CapApp.removeAllListeners();
      }
      audioService.cleanup();
    };
  }, []);

  const handleConsent = () => {
    setConsentimentoRealizado(true);
  };

  if (carregando) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <>
      {!consentimentoRealizado && (
        <ConsentimentoPrivacidade onConsent={handleConsent} />
      )}
      
      <MensagensProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<TelaInicial />} />
              <Route path="/jogo" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </MensagensProvider>
    </>
  );
}

export default App;