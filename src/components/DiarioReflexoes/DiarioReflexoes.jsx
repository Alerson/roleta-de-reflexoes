import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './DiarioReflexoes.css';
import Botao from '../../components/Botao';
import MusicaControle from '../../components/MusicaControle';

const DiarioReflexoes = () => {
  const [reflexoes, setReflexoes] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar o jogador atual
    const playerData = localStorage.getItem('currentPlayer');
    if (playerData) {
      setCurrentPlayer(JSON.parse(playerData));
    } else {
      navigate('/');
      return;
    }

    // Carregar as reflexões salvas do jogador atual
    carregarReflexoes();
  }, [navigate]);

  const carregarReflexoes = () => {
    const playerData = localStorage.getItem('currentPlayer');
    if (!playerData) return;
    
    const player = JSON.parse(playerData);
    
    // Buscar reflexões específicas do jogador atual
    const todasReflexoes = localStorage.getItem('diarioReflexoes');
    if (todasReflexoes) {
      const reflexoesObj = JSON.parse(todasReflexoes);
      // Filtrar reflexões apenas do jogador atual
      const reflexoesJogador = reflexoesObj[player.id] || [];
      
      // Ordenar do mais recente para o mais antigo
      reflexoesJogador.sort((a, b) => new Date(b.data) - new Date(a.data));
      
      setReflexoes(reflexoesJogador);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  const excluirReflexao = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const confirmarExclusao = () => {
    if (deleteIndex === null) return;
    
    const novasReflexoes = [...reflexoes];
    novasReflexoes.splice(deleteIndex, 1);
    
    // Atualizar localStorage
    const todasReflexoes = localStorage.getItem('diarioReflexoes');
    if (todasReflexoes && currentPlayer) {
      const reflexoesObj = JSON.parse(todasReflexoes);
      reflexoesObj[currentPlayer.id] = novasReflexoes;
      localStorage.setItem('diarioReflexoes', JSON.stringify(reflexoesObj));
    }
    
    setReflexoes(novasReflexoes);
    setShowModal(false);
    setDeleteIndex(null);
  };
  
  // Componente para o modal de confirmação usando Portal
  const ModalConfirmacao = ({ isOpen, onCancel, onConfirm }) => {
    // Impedir o scroll do body quando o modal estiver aberto
    useEffect(() => {
      if (isOpen) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    const modalContent = (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
          <h3>Confirmar exclusão</h3>
          <p>Tem certeza que deseja excluir esta reflexão?</p>
          <div className="modal-actions">
            <button 
              className="cancel-button"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              className="confirm-button"
              onClick={onConfirm}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    );
    
    // Criar elemento modal-root se não existir
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root') || document.body
    );
  };

  const voltarParaJogo = () => {
    navigate('/jogo');
  };

  return (
    <div className="diario-container">
      <div className="decoracao-bolhas">
        <div className="bolha bolha1"></div>
        <div className="bolha bolha2"></div>
        <div className="bolha bolha3"></div>
        <div className="bolha bolha4"></div>
      </div>
      
      <h1 className="diario-title">Meu Diário de Reflexões</h1>
      
      <div className="nav-container">
        <div className="nav-left">
          <button className="botao-voltar" onClick={voltarParaJogo}>
            <span className="botao-voltar-icon">←</span> Voltar
          </button>
        </div>
        
        <div className="nav-right">
          <MusicaControle />
          
          {currentPlayer && (
            <div className="player-info">
              <div className={`avatar avatar-${currentPlayer.avatar || 1}`}></div>
              <span className="player-name">{currentPlayer.name}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="diario-content">
        {reflexoes.length === 0 ? (
          <div className="sem-reflexoes">
            <p>Você ainda não tem reflexões salvas.</p>
            <p>Quando girar a roleta e receber uma pergunta, você poderá escrever e salvar sua resposta aqui.</p>
            <Botao texto="Voltar para o Jogo" onClick={voltarParaJogo} />
          </div>
        ) : (
          <div className="lista-reflexoes">
            {reflexoes.map((reflexao, index) => (
              <div key={index} className="reflexao-card">
                <div className="reflexao-data">
                  {formatarData(reflexao.data)}
                </div>
                <div className="reflexao-categoria">
                  Categoria: <span className={`categoria-tag ${reflexao.categoria}`}>
                    {reflexao.categoria.charAt(0).toUpperCase() + reflexao.categoria.slice(1)}
                  </span>
                </div>
                <div className="reflexao-pergunta">{reflexao.pergunta}</div>
                <div className="reflexao-resposta">{reflexao.resposta}</div>
                <button 
                  className="excluir-reflexao"
                  onClick={() => excluirReflexao(index)}
                  aria-label="Excluir reflexão"
                >
                  <span className="icone-excluir">×</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ModalConfirmacao 
        isOpen={showModal} 
        onCancel={() => setShowModal(false)} 
        onConfirm={confirmarExclusao} 
      />
    </div>
  );
};

export default DiarioReflexoes;