import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MensagensProvider } from './context/MensagensContext';
import Home from './pages/Home/Home';
import TelaInicial from './pages/TelaInicial/TelaInicial';
import ConsentimentoPrivacidade from './components/ConsentimentoPrivacidade/ConsentimentoPrivacidade';
import './styles/global.css';

function App() {
  const [consentimentoRealizado, setConsentimentoRealizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Verificar se o usuário já deu consentimento
  useEffect(() => {
    const privacyConsent = localStorage.getItem('privacyConsent');
    if (privacyConsent === 'true') {
      setConsentimentoRealizado(true);
    }
    setCarregando(false);
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