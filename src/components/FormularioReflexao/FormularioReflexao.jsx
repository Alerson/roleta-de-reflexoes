import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { MensagensContext } from '../../context/MensagensContext';
import './FormularioReflexao.css';
import Botao from '../../components/Botao';

const FormularioReflexaoContent = ({ onClose }) => {
  const { cartaSelecionada, categoriaAtual } = useContext(MensagensContext);
  const [resposta, setResposta] = useState('');
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

  // Impedir o scroll do body quando o modal estiver aberto
  useEffect(() => {
    // Guardar o overflow original
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Impedir o scroll
    document.body.style.overflow = 'hidden';
    
    // Restaurar ao desmontar
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const salvarReflexao = () => {
    if (!resposta.trim()) {
      setErro('Por favor, escreva sua resposta para salvar.');
      return;
    }

    try {
      // Obter o jogador atual
      const playerData = localStorage.getItem('currentPlayer');
      if (!playerData) {
        setErro('Erro ao identificar o jogador atual.');
        return;
      }
      
      const player = JSON.parse(playerData);
      
      // Criar objeto de reflexão
      const reflexao = {
        pergunta: cartaSelecionada,
        resposta: resposta.trim(),
        categoria: categoriaAtual,
        data: new Date().toISOString()
      };
      
      // Buscar reflexões existentes ou criar novo objeto
      let todasReflexoes = {};
      const reflexoesExistentes = localStorage.getItem('diarioReflexoes');
      
      if (reflexoesExistentes) {
        todasReflexoes = JSON.parse(reflexoesExistentes);
      }
      
      // Adicionar reflexão ao jogador atual
      if (!todasReflexoes[player.id]) {
        todasReflexoes[player.id] = [];
      }
      
      todasReflexoes[player.id].unshift(reflexao);
      
      // Salvar no localStorage
      localStorage.setItem('diarioReflexoes', JSON.stringify(todasReflexoes));
      
      // Mostrar confirmação
      setErro('');
      setSalvo(true);
      
      // Fechar o formulário após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao salvar reflexão:', error);
      setErro('Ocorreu um erro ao salvar. Tente novamente.');
    }
  };

  // Manipulador para impedir a propagação de cliques
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="formulario-reflexao-overlay" onClick={onClose}>
      <div className="formulario-reflexao" onClick={handleContainerClick}>
        <button 
          className="fechar-formulario"
          onClick={onClose}
          aria-label="Fechar formulário"
        >
          ×
        </button>
        
        <h2>Registrar Reflexão</h2>
        
        <div className="pergunta-container">
          <p className="label-pergunta">Pergunta:</p>
          <p className="texto-pergunta">{cartaSelecionada}</p>
        </div>
        
        <div className="resposta-container">
          <label htmlFor="resposta" className="label-resposta">
            Sua resposta:
          </label>
          <textarea
            id="resposta"
            className="campo-resposta"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Escreva sua reflexão aqui..."
            rows={6}
            disabled={salvo}
          ></textarea>
        </div>
        
        {erro && <p className="mensagem-erro">{erro}</p>}
        
        {salvo ? (
          <div className="mensagem-sucesso">
            <p>✓ Sua reflexão foi salva com sucesso!</p>
          </div>
        ) : (
          <div className="botoes-formulario">
            <Botao texto="Cancelar" onClick={onClose} />
            <Botao texto="Salvar no Diário" onClick={salvarReflexao} />
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal que usa ReactDOM.createPortal
const FormularioReflexao = (props) => {
  // Criar elemento modal-root se não existir
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    
    // Limpeza ao desmontar
    return () => {
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot && modalRoot.childNodes.length === 0) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);
  
  return ReactDOM.createPortal(
    <FormularioReflexaoContent {...props} />,
    document.getElementById('modal-root') || document.body
  );
};

export default FormularioReflexao;