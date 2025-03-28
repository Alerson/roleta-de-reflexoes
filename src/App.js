import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MensagensProvider } from './context/MensagensContext';
import Home from './pages/Home/Home';
import Inicio from './pages/Inicio/Inicio';
import './styles/global.css';

function App() {
  return (
    <MensagensProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/jogo" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </MensagensProvider>
  );
}

export default App;