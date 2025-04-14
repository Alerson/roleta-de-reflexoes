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

  // Etapas do tutorial - removidas as posições diferentes para manter sempre centralizado
  const tutorialSteps = [
    {
      title: "Bem-vindo à Roleta de Reflexões!",
      description: "Este aplicativo foi criado para fortalecer os laços familiares através de perguntas e reflexões."
    },
    {
      title: "Escolha uma Categoria",
      description: "Selecione entre Família, Crianças ou Valores para diferentes tipos de perguntas."
    },
    {
      title: "Gire a Roleta",
      description: "Toque no botão para girar a roleta e receber uma pergunta aleatória."
    },
    {
      title: "Reflita e Compartilhe",
      description: "Discuta a pergunta selecionada com sua família para momentos de conexão significativa."
    },
    {
      title: "Pronto para Começar!",
      description: "Agora você sabe como usar a Roleta de Reflexões. Divirta-se com sua família!"
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
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="tutorial-overlay" onClick={nextStep}>
      <div className="tutorial-card" onClick={(e) => e.stopPropagation()}>
        <h3>{currentTutorial.title}</h3>
        <p>{currentTutorial.description}</p>
        <button className="tutorial-action" onClick={nextStep}>
          {isLastStep ? "Começar a Jogar" : "Próximo"}
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