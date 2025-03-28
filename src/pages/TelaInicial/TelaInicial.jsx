import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelaInicial.css';

const TelaInicial = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [avatarSelected, setAvatarSelected] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [editandoJogadores, setEditandoJogadores] = useState(false);
  const navigate = useNavigate();

  // Efeito para carregar jogadores salvos do localStorage
  useEffect(() => {
    const loadSavedPlayers = () => {
      const players = localStorage.getItem('roletaPlayers');
      if (players) {
        setSavedPlayers(JSON.parse(players));
      }
    };

    // Configurar a animação inicial
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => setShowForm(true), 500);
    }, 2500); // Duração da animação inicial

    loadSavedPlayers();

    return () => clearTimeout(animationTimer);
  }, []);

  // Salvar o jogador e iniciar o jogo
  const handleStartGame = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert('Por favor, insira seu nome para continuar!');
      return;
    }

    // Criar objeto do jogador
    const player = {
      name: playerName,
      avatar: avatarSelected,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Verificar se o jogador já existe
    const existingPlayerIndex = savedPlayers.findIndex(p => 
      p.name.toLowerCase() === playerName.toLowerCase()
    );

    let updatedPlayers = [...savedPlayers];
    
    if (existingPlayerIndex >= 0) {
      // Atualizar jogador existente
      updatedPlayers[existingPlayerIndex] = {
        ...updatedPlayers[existingPlayerIndex],
        avatar: avatarSelected,
        lastPlayed: new Date().toISOString()
      };
    } else {
      // Adicionar novo jogador
      updatedPlayers.push(player);
    }

    // Salvar no localStorage
    localStorage.setItem('roletaPlayers', JSON.stringify(updatedPlayers));
    
    // Salvar jogador atual
    localStorage.setItem('currentPlayer', JSON.stringify(player));

    // Navegar para a tela do jogo
    navigate('/jogo');
  };

  // Carregar um jogador salvo
  const loadSavedPlayer = (player) => {
    setPlayerName(player.name);
    setAvatarSelected(player.avatar || 1);
  };

  // Função para excluir um jogador
  const excluirJogador = (jogadorId) => {
    const jogadoresAtualizados = savedPlayers.filter(player => player.id !== jogadorId);
    setSavedPlayers(jogadoresAtualizados);
    localStorage.setItem('roletaPlayers', JSON.stringify(jogadoresAtualizados));
    
    // Se o jogador atual foi excluído, limpe também as referências dele
    const currentPlayerData = localStorage.getItem('currentPlayer');
    if (currentPlayerData) {
      const currentPlayer = JSON.parse(currentPlayerData);
      if (currentPlayer.id === jogadorId) {
        localStorage.removeItem('currentPlayer');
      }
    }
  };

  // Função para limpar todo o histórico de jogadores
  const limparTodosJogadores = () => {
    if (window.confirm('Tem certeza que deseja remover todos os jogadores salvos?')) {
      setSavedPlayers([]);
      localStorage.removeItem('roletaPlayers');
      localStorage.removeItem('currentPlayer');
    }
  };

  // Renderizar avatares para seleção
  const renderAvatarOptions = () => {
    const avatars = [1, 2, 3, 4, 5, 6]; // IDs dos avatares disponíveis
    
    return (
      <div className="avatar-selection">
        <p>Escolha seu avatar:</p>
        <div className="avatar-options">
          {avatars.map(id => (
            <div 
              key={id}
              className={`avatar-option ${avatarSelected === id ? 'selected' : ''}`}
              onClick={() => setAvatarSelected(id)}
            >
              <div className={`avatar avatar-${id}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="tela-inicial">
      <div className={`logo-container ${animationComplete ? 'animation-complete' : ''}`}>
        <div className="logo-circle">
          <div className="logo-inner">
            <span>Roleta de Reflexões</span>
          </div>
        </div>
      </div>
      
      {showForm && (
        <div className="form-container fade-in">
          <h2>Bem-vindo à Roleta de Reflexões!</h2>
          <p className="subtitle">Um jogo para fortalecer os laços familiares</p>
          
          <form onSubmit={handleStartGame}>
            <div className="input-container">
              <label htmlFor="playerName">Como devemos te chamar?</label>
              <input 
                type="text" 
                id="playerName" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Digite seu nome"
                autoComplete="off"
              />
            </div>
            
            {renderAvatarOptions()}
            
            <button type="submit" className="start-button">
              Começar a Jogar
            </button>
          </form>
          
          {savedPlayers.length > 0 && (
            <div className="saved-players">
              <div className="saved-players-header">
                <p>Jogadores anteriores:</p>
                <button 
                  className="edit-players-button"
                  onClick={() => setEditandoJogadores(!editandoJogadores)}
                >
                  {editandoJogadores ? 'Concluído' : 'Editar'}
                </button>
              </div>
              
              <div className="player-list">
                {savedPlayers.map(player => (
                  <div 
                    key={player.id} 
                    className={`saved-player ${editandoJogadores ? 'editing' : ''}`}
                    onClick={() => !editandoJogadores && loadSavedPlayer(player)}
                  >
                    <div className={`avatar avatar-${player.avatar || 1}`}></div>
                    <span>{player.name}</span>
                    
                    {editandoJogadores && (
                      <button 
                        className="delete-player-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          excluirJogador(player.id);
                        }}
                        aria-label="Excluir jogador"
                      >
                        <span role="img" aria-label="Excluir">×</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {editandoJogadores && savedPlayers.length > 0 && (
                <button 
                  className="clear-all-players-button"
                  onClick={limparTodosJogadores}
                >
                  Remover todos os jogadores
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="decoracao-bolhas">
        <div className="bolha bolha1"></div>
        <div className="bolha bolha2"></div>
        <div className="bolha bolha3"></div>
        <div className="bolha bolha4"></div>
      </div>
    </div>
  );
};

export default TelaInicial;