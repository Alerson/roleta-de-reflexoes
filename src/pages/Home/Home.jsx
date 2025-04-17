import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Roleta from '../../components/Roleta';
import SeletorCategoria from '../../components/SeletorCategoria';
import CartaReflexao from '../../components/CartaReflexao';
import Botao from '../../components/Botao';
import MusicaControle from '../../components/MusicaControle';
import Tutorial from '../../components/Tutorial/Tutorial';
import { useRoleta } from '../../hooks/useRoleta';
import { MensagensContext } from '../../context/MensagensContext';
import './Home.css';

const Home = () => {
  const { girar, angulo, girarRoleta } = useRoleta();
  const { cartaSelecionada, limparCartaSelecionada } = useContext(MensagensContext);
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [mostrarPolitica, setMostrarPolitica] = useState(false);
  const [tutorialCompleto, setTutorialCompleto] = useState(false);

  // Carregar dados do jogador e limpar carta apenas na montagem inicial
  useEffect(() => {
    // Verificar se há um jogador atual
    const player = localStorage.getItem('currentPlayer');
    
    if (player) {
      setCurrentPlayer(JSON.parse(player));
      // Limpar qualquer carta que possa estar selecionada de uma sessão anterior
      // Apenas na montagem inicial do componente
      limparCartaSelecionada();

      // Verificar se o tutorial já foi mostrado
      const showTutorial = localStorage.getItem('showTutorial');
      if (showTutorial === 'false') {
        setTutorialCompleto(true);
      }
    } else {
      // Redirecionar para a tela inicial se não tiver jogador
      navigate('/');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const voltarInicio = () => {
    limparCartaSelecionada();
    navigate('/');
  };

  const navegarParaDiario = () => {
    navigate('/diario');
  };

  const handleTutorialComplete = () => {
    setTutorialCompleto(true);
  };

  return (
    <div className="home-container">
      {/* Adicionando bolhas decorativas como na TelaInicial */}
      <div className="decoracao-bolhas">
        <div className="bolha bolha1"></div>
        <div className="bolha bolha2"></div>
        <div className="bolha bolha3"></div>
        <div className="bolha bolha4"></div>
      </div>
      
      {!tutorialCompleto && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}
      
      <h1 className="app-title">Roleta de Reflexões</h1>
      
      <div className="nav-container">
        <div className="nav-left">
          <button className="botao-voltar" onClick={voltarInicio}>
            <span className="botao-voltar-icon">←</span> Voltar
          </button>
        </div>
        
        <div className="nav-right">
          {/* Novo botão para o diário */}
          <button
            className="botao-diario"
            onClick={navegarParaDiario}
            title="Meu Diário de Reflexões"
          >
            <span className="diario-icon">📔</span>
          </button>
          
          {/* Controle de música */}
          <MusicaControle />
          
          {currentPlayer && (
            <div className="player-info">
              <div className={`avatar avatar-${currentPlayer.avatar || 1}`}></div>
              <span className="player-name">{currentPlayer.name}</span>
            </div>
          )}
        </div>
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
        </div>
        
        {cartaSelecionada && (
          <div className="resultado-area">
            <CartaReflexao mensagem={cartaSelecionada} />
          </div>
        )}
      </div>
      
      <div className="footer">
        <button 
          className="politica-link"
          onClick={() => setMostrarPolitica(true)}
        >
          Política de Privacidade
        </button>
        <button 
          className="politica-link tutorial-link"
          onClick={() => {
            // Resetar o tutorial e mostrar novamente
            localStorage.setItem('showTutorial', 'true');
            setTutorialCompleto(false);
          }}
        >
          Ver Tutorial
        </button>
      </div>
      
      {mostrarPolitica && (
        <div className="politica-modal-overlay" onClick={() => setMostrarPolitica(false)}>
          <div className="politica-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="fechar-modal"
              onClick={() => setMostrarPolitica(false)}
            >
              ×
            </button>
            
            <h2>Política de Privacidade</h2>
            
            <div className="politica-conteudo">
              <h3>Informações Coletadas</h3>
              <p>
                O aplicativo Roleta de Reflexões coleta e armazena localmente:
                <ul>
                  <li>Nome de usuário</li>
                  <li>Avatar selecionado</li>
                  <li>Preferências de categoria</li>
                  <li>Histórico de uso do aplicativo</li>
                  <li>Preferências de música (ativada/desativada)</li>
                  <li>Reflexões salvas no diário</li>
                </ul>
              </p>
              
              <h3>Como Usamos Suas Informações</h3>
              <p>
                Utilizamos suas informações exclusivamente para personalizar sua experiência 
                no aplicativo e lembrar suas preferências entre sessões.
              </p>
              
              <h3>Armazenamento e Dados</h3>
              <p>
                Todas as informações são armazenadas localmente no seu dispositivo. 
                Não compartilhamos seus dados com terceiros.
              </p>
              
              <h3>Seus Direitos</h3>
              <p>
                Você pode acessar, corrigir ou excluir seus dados a qualquer momento
                através da opção "Limpar todos os dados do perfil" nas configurações.
              </p>
              
              <h3>Contato</h3>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato 
                pelo e-mail: alerson.rigo@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;