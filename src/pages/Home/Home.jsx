import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Roleta from '../../components/Roleta';
import SeletorCategoria from '../../components/SeletorCategoria';
import CartaReflexao from '../../components/CartaReflexao';
import Botao from '../../components/Botao';
import { useRoleta } from '../../hooks/useRoleta';
import { MensagensContext } from '../../context/MensagensContext';
import './Home.css';

const Home = () => {
  const { girar, angulo, girarRoleta } = useRoleta();
  const { cartaSelecionada } = useContext(MensagensContext);
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [activeTab, setActiveTab] = useState('conquistas');
  const [modalAberto, setModalAberto] = useState(false);

  // Detectar agitação do dispositivo para girar roleta
  const handleDeviceMotion = useCallback((event) => {
    const acceleration = event.accelerationIncludingGravity;
    
    if (!acceleration) return;
    
    const movement = 
      Math.abs(acceleration.x) + 
      Math.abs(acceleration.y) + 
      Math.abs(acceleration.z);
    
    // Se movimento for maior que limite e não estiver girando
    if (movement > 25 && !girar && !isShaking) {
      setIsShaking(true);
      
      // Vibrar o dispositivo se a API estiver disponível
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      
      // Girar a roleta
      girarRoleta();
      
      // Resetar estado após um tempo
      setTimeout(() => setIsShaking(false), 1000);
    }
  }, [girar, girarRoleta, isShaking]);

  // Carregar dados do jogador e inicializar estado
  useEffect(() => {
    // Verificar se há um jogador atual
    const player = localStorage.getItem('currentPlayer');
    
    if (player) {
      setCurrentPlayer(JSON.parse(player));
    } else {
      // Redirecionar para a tela inicial se não tiver jogador
      navigate('/');
      return;
    }

    // Carregar realizações do jogador
    const savedAchievements = localStorage.getItem(`achievements_${JSON.parse(player).id}`);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }

    // Adicionar evento de vibração ao girar
    window.addEventListener("devicemotion", handleDeviceMotion);
    
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [navigate, handleDeviceMotion]);

  const voltarInicio = () => {
    navigate('/');
  };

  // Alternar aba no modal
  const trocarAba = (aba) => {
    setActiveTab(aba);
  };

  // Abrir e fechar modal
  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  // Adicionar uma conquista
  const addAchievement = useCallback((id, title) => {
    if (!achievements.some(a => a.id === id)) {
      const newAchievement = { id, title, date: new Date().toISOString() };
      const updatedAchievements = [...achievements, newAchievement];
      
      setAchievements(updatedAchievements);
      if (currentPlayer) {
        localStorage.setItem(`achievements_${currentPlayer.id}`, JSON.stringify(updatedAchievements));
      }
      
      // Mostrar notificação
      showAchievementNotification(title);
    }
  }, [achievements, currentPlayer]);

  // Mostrar notificação de conquista
  const showAchievementNotification = (title) => {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">
        <span role="img" aria-label="Troféu">🏆</span>
      </div>
      <div class="achievement-content">
        <div class="achievement-title">Conquista Desbloqueada!</div>
        <div class="achievement-desc">${title}</div>
      </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Vibrar o dispositivo se a API estiver disponível
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remover após alguns segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  // Função para limpar as conquistas
  const limparConquistas = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as suas conquistas?')) {
      setAchievements([]);
      if (currentPlayer) {
        localStorage.removeItem(`achievements_${currentPlayer.id}`);
      }
      // Feedback tátil
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  // Função para limpar todas as estatísticas
  const limparEstatisticas = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as estatísticas deste perfil?')) {
      // Limpar conquistas
      setAchievements([]);
      // Limpar contagem de giros
      if (currentPlayer) {
        localStorage.removeItem(`achievements_${currentPlayer.id}`);
        localStorage.removeItem(`spins_${currentPlayer.id}`);
      }
      // Feedback tátil
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 100, 100, 100]);
      }
    }
  };

  // Verificar conquistas quando a roleta parar
  useEffect(() => {
    if (cartaSelecionada && currentPlayer) {
      // Verificar conquista de primeira reflexão
      if (!achievements.some(a => a.id === 'first_spin')) {
        addAchievement('first_spin', 'Primeira Reflexão');
      }
      
      // Verificar o número de giros (salvo no localStorage)
      const spinCount = parseInt(localStorage.getItem(`spins_${currentPlayer.id}`) || '0') + 1;
      localStorage.setItem(`spins_${currentPlayer.id}`, spinCount.toString());
      
      // Conquistas baseadas em número de giros
      if (spinCount === 10 && !achievements.some(a => a.id === 'ten_spins')) {
        addAchievement('ten_spins', 'Dez Reflexões');
      } else if (spinCount === 50 && !achievements.some(a => a.id === 'fifty_spins')) {
        addAchievement('fifty_spins', 'Cinquenta Reflexões');
      }
    }
  }, [cartaSelecionada, currentPlayer, achievements, addAchievement]);

  // Renderizar as abas do modal
  const renderModalContent = () => {
    switch (activeTab) {
      case 'conquistas':
        return (
          <div className="tab-content">
            {achievements.length === 0 ? (
              <p className="mensagem-vazia">Continue jogando para desbloquear conquistas!</p>
            ) : (
              <div className="lista-conquistas">
                {achievements.map(achievement => (
                  <div className="conquista-item" key={achievement.id}>
                    <div className="conquista-icon">
                      <span role="img" aria-label="Troféu">🏆</span>
                    </div>
                    <div className="conquista-info">
                      <h3>{achievement.title}</h3>
                      <p>{new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'configuracoes':
        return (
          <div className="tab-content">
            <div className="config-section">
              <h3 className="config-title">Gerenciar dados do perfil</h3>
              
              <button 
                className="config-button"
                onClick={limparConquistas}
              >
                <span className="config-icon" role="img" aria-label="Troféu">🏆</span>
                Limpar todas as conquistas
              </button>
              
              <button 
                className="config-button danger"
                onClick={limparEstatisticas}
              >
                <span className="config-icon" role="img" aria-label="Atenção">⚠️</span>
                Limpar todos os dados do perfil
              </button>
            </div>
          </div>
        );
      
      default:
        return <div>Selecione uma aba</div>;
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <button className="botao-voltar" onClick={voltarInicio}>
          <span className="botao-voltar-icon">←</span> Voltar
        </button>
        <h1>Roleta de Reflexões</h1>
        
        {currentPlayer && (
          <div className="player-info" onClick={abrirModal}>
            <div className={`avatar avatar-${currentPlayer.avatar || 1}`}></div>
            <span className="player-name">{currentPlayer.name}</span>
          </div>
        )}
      </div>
      
      <div className={`jogo-area ${cartaSelecionada ? 'has-result' : ''}`}>
        <div className="controles-area">
          <SeletorCategoria />
          
          <Roleta girar={girar} angulo={angulo} />
          
          <Botao 
            texto="Girar Roleta" 
            onClick={girarRoleta} 
            disabled={girar} 
          />
          
          {/* Instrução para agitar o dispositivo */}
          <p className="shake-instruction">
            Ou agite o dispositivo para girar a roleta!
          </p>
        </div>
        
        {cartaSelecionada && (
          <div className="resultado-area">
            <CartaReflexao mensagem={cartaSelecionada} />
            {/* Removida a div com os botões de ação */}
          </div>
        )}
      </div>
      
      {/* Modal de perfil simplificado, usando estado React em vez de manipulação DOM direta */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <button 
              className="modal-fechar"
              onClick={fecharModal}
            >
              ×
            </button>
            
            <div className="perfil-header">
              {currentPlayer && (
                <>
                  <div className={`avatar avatar-${currentPlayer.avatar || 1} avatar-large`}></div>
                  <h2>{currentPlayer.name}</h2>
                </>
              )}
            </div>
            
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'conquistas' ? 'active' : ''}`}
                onClick={() => trocarAba('conquistas')}
              >
                Conquistas
              </button>
              {/* Removida a aba de favoritos */}
              <button 
                className={`tab-button ${activeTab === 'configuracoes' ? 'active' : ''}`}
                onClick={() => trocarAba('configuracoes')}
              >
                Configurações
              </button>
            </div>
            
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;