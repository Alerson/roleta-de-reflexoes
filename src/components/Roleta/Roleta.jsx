import React from 'react';
import './Roleta.css';

const Roleta = ({ girar, angulo }) => {
  // Cores vibrantes para os setores da roleta
  const cores = [
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#64FFDA', '#69F0AE'
  ];

  // Criar os setores da roleta
  const numSetores = 10;
  const setores = [];
  
  for (let i = 0; i < numSetores; i++) {
    const anguloInicio = i * (360 / numSetores);
    const anguloFim = (i + 1) * (360 / numSetores);
    
    const inicioRad = (anguloInicio - 90) * Math.PI / 180;
    const fimRad = (anguloFim - 90) * Math.PI / 180;
    
    const raio = 140;
    const centroX = 150;
    const centroY = 150;
    
    const x1 = centroX + raio * Math.cos(inicioRad);
    const y1 = centroY + raio * Math.sin(inicioRad);
    const x2 = centroX + raio * Math.cos(fimRad);
    const y2 = centroY + raio * Math.sin(fimRad);
    
    // Caminho SVG para um setor
    const largeArcFlag = (anguloFim - anguloInicio) > 180 ? 1 : 0;
    
    const d = `M ${centroX},${centroY} L ${x1},${y1} A ${raio},${raio} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
    
    setores.push({
      d,
      cor: cores[i % cores.length],
      texto: i + 1,
      anguloTexto: anguloInicio + (360 / numSetores) / 2
    });
  }

  return (
    <div className="roleta-container">
      <svg
        className="roleta"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ 
          transform: `rotate(${angulo}deg)`,
          transition: girar ? 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
        }}
      >
        {/* Setores da roleta */}
        {setores.map((setor, index) => (
          <g key={index}>
            <path
              d={setor.d}
              fill={setor.cor}
              stroke="#ffffff"
              strokeWidth="1"
            />
            <text
              x="150"
              y="150"
              dy="-90" // Ajuste para posicionar o texto próximo à borda
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(${setor.anguloTexto}, 150, 150)`}
            >
              {setor.texto}
            </text>
          </g>
        ))}
        
        {/* Círculo central */}
        <circle cx="150" cy="150" r="50" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <text x="150" y="150" textAnchor="middle" dominantBaseline="middle" fill="#7e22ce" fontWeight="600" fontSize="12">
          <tspan x="150" y="145">Gire para</tspan>
          <tspan x="150" y="165">reflexão</tspan>
        </text>
      </svg>
      
      {/* Indicador (seta) */}
      <div className="indicador"></div>
    </div>
  );
};

export default Roleta;