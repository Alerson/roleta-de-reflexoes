import React, { useState, useEffect } from 'react';
import './Tutorial.css';

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  // Verificar se o tutorial deve ser mostrado
  useEffect(() => {
    // Verificar localStorage apenas uma vez na montagem inicial
    try {
      const showTutorial = localStorage.getItem('showTutorial');
      if (showTutorial === 'false') {
        setVisible(false);
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error("Erro ao verificar estado do tutorial:", error);
      // Em caso de erro, garantir que o tutorial não bloqueie a aplicação
      setVisible(false);
      if (onComplete) onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependência vazia para executar apenas uma vez

  // Etapas do tutorial
  const tutorialSteps = [
    {
      title: "Bem-vindo à Roleta de Reflexões!",
      description: "Este aplicativo foi criado para fortalecer os laços familiares através de perguntas e reflexões.",
      action: "Deslize para a próxima etapa →",
      position: "center",
    },
    {
      title: "Escolha uma Categoria",
      description: "Selecione entre Família, Crianças ou Valores para diferentes tipos de perguntas.",
      action: "Deslize para continuar →",
      position: "top",
      highlight: "seletor-categoria",
    },
    {
      title: "Gire a Roleta",
      description: "Toque no botão para girar a roleta e receber uma pergunta aleatória.",
      action: "Deslize para continuar →",
      position: "middle",
      highlight: "roleta-container",
    },
    {
      title: "Reflita e Compartilhe",
      description: "Discuta a pergunta selecionada com sua família para momentos de conexão significativa.",
      action: "Deslize para continuar →",
      position: "bottom",
      highlight: "carta-reflexao",
    },
    {
      title: "Pronto para Começar!",
      description: "Agora você sabe como usar a Roleta de Reflexões. Divirta-se com sua família!",
      action: "Começar a Jogar",
      position: "center",
    },
  ];

  // Navegar para a próxima etapa
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  // Marcar tutorial como concluído
  const completeTutorial = () => {
    try {
      localStorage.setItem('showTutorial', 'false');
    } catch (error) {
      console.error("Erro ao salvar estado do tutorial:", error);
    }
    setVisible(false);
    if (onComplete) onComplete();
  };

  // Se o tutorial não deve ser mostrado
  if (!visible) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="tutorial-overlay" onClick={nextStep}>
      {currentTutorial.highlight && (
        <div className={`tutorial-highlight ${currentTutorial.highlight}`}></div>
      )}
      
      <div className={`tutorial-card ${currentTutorial.position}`} onClick={(e) => e.stopPropagation()}>
        <h3>{currentTutorial.title}</h3>
        <p>{currentTutorial.description}</p>
        <button className="tutorial-action" onClick={nextStep}>
          {currentTutorial.action}
        </button>
        
        <div className="tutorial-progress">
          {tutorialSteps.map((_, index) => (
            <div 
              key={index} 
              className={`tutorial-dot ${index === currentStep ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentStep(index);
              }}
            ></div>
          ))}
        </div>
        
        <button className="tutorial-skip" onClick={completeTutorial}>
          Pular Tutorial
        </button>
      </div>
    </div>
  );
};

export default Tutorial;