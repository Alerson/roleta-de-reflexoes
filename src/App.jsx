import React from 'react';
import { MensagensProvider } from './context/MensagensContext';
import Home from './pages/Home';
import './styles/global.css';

function App() {
  return (
    <MensagensProvider>
      <div className="App">
        <Home />
      </div>
    </MensagensProvider>
  );
}

export default App;