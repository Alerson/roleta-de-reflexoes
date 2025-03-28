import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MensagensProvider } from './context/MensagensContext';
import Home from './pages/Home/Home';
import TelaInicial from './pages/TelaInicial/TelaInicial';
import './styles/global.css';

function App() {
  // Verificar se é a primeira visita para mostrar tutorial
  useEffect(() => {
    const firstVisit = localStorage.getItem('firstVisit');
    if (!firstVisit) {
      localStorage.setItem('firstVisit', 'false');
      localStorage.setItem('showTutorial', 'true');
    }
  }, []);

  return (
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
  );
}

export default App;