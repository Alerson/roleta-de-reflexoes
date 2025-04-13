import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Roleta from '../../components/Roleta';
import SeletorCategoria from '../../components/SeletorCategoria';
import CartaReflexao from '../../components/CartaReflexao';
import Botao from '../../components/Botao';
import MusicaControle from '../../components/MusicaControle';
import { useRoleta } from '../../hooks/useRoleta';
import { MensagensContext } from '../../context/MensagensContext';
import './Home.css';

const Home = () => {
  const { girar, angulo, girarRoleta } = useRoleta();
  const { cartaSelecionada, limparCartaSelecionada } = useContext(MensagensContext);
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [mostrarPolitica, setMostrarPolitica] = useState(false);

  // Carregar dados do jogador e limpar carta apenas na montagem inicial
  useEffect(() => {
    // Verificar se há um jogador atual
    const player = localStorage.getItem('currentPlayer');
    
    if (player) {
      setCurrentPlayer(JSON.parse(player));
      // Limpar qualquer carta que possa estar selecionada de uma sessão anterior
      // Apenas na montagem inicial do componente
      limparCartaSelecionada();
    } else {
      // Redirecionar para a tela inicial se não tiver jogador
      navigate('/');
      return;
    }
    // Remova limparCartaSelecionada das dependências para evitar re-execução
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const voltarInicio = () => {
    limparCartaSelecionada();
    navigate('/');
  };

  return (
    <div className="home-container">
      <h1 className="app-title">Roleta de Reflexões</h1>
      
      <div className="nav-container">
        <div className="nav-left">
          <button className="botao-voltar" onClick={voltarInicio}>
            <span className="botao-voltar-icon">←</span> Voltar
          </button>
        </div>
        
        <div className="nav-right">
          {/* Controle de música adicionado aqui */}
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
                </ul>
              </p>
              
              <h3>Como Usamos Suas Informações</h3>
              <p>
                Utilizamos suas informações exclusivamente para personalizar sua experiência 
                no aplicativo e lembrar suas preferências entre sessões.
              </p>
              
              <h3>Armazenamento de Dados</h3>
              <p>
                Todas as informações são armazenadas localmente no seu dispositivo. 
                Não enviamos nenhuma de suas informações para servidores externos.
              </p>
              
              <h3>Seus Direitos</h3>
              <p>
                Você pode acessar, corrigir ou excluir seus dados a qualquer momento
                nas configurações do aplicativo.
              </p>
              
              <h3>Contato</h3>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato 
                pelo e-mail: [seu-email@exemplo.com]
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;