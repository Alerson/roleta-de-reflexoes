import React from 'react';
import './Roleta.css';

const Roleta = ({ girar, angulo }) => {
  return (
    <div className="roleta-container">
      <div 
        className="roleta"
        style={{ 
          transform: `rotate(${angulo}deg)`,
          transition: girar ? 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
        }}
      >
        <div className="roleta-centro">
          <span>Gire para reflexão</span>
        </div>
      </div>
      <div className="indicador"></div>
    </div>
  );
};

export default Roleta;