import React, { useEffect, useState, useContext } from 'react';
import { MensagensContext } from '../../context/MensagensContext';
import FormularioReflexao from '../FormularioReflexao/FormularioReflexao';
import './CartaReflexao.css';

const CartaReflexao = ({ mensagem }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFormulario, setShowFormulario] = useState(false);
  const { categoriaAtual } = useContext(MensagensContext);
  
  // Determinar o título com base na categoria atual
  const getTitulo = () => {
    if (categoriaAtual === 'motivacao') {
      return "Mensagem motivacional";
    }
    return "Reflexão";
  };
  
  // Efeito para ativar a animação quando o componente é montado
  useEffect(() => {
    // Pequeno delay para garantir que a animação ocorra após a roleta parar
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Log para debug
    console.log('CartaReflexao recebeu mensagem:', mensagem);
    
    return () => clearTimeout(timer);
  }, [mensagem]);

  // Função para compartilhar no WhatsApp
  const compartilharWhatsApp = () => {
    const textoFormatado = encodeURIComponent(`"${mensagem}" - Roleta de Reflexões`);
    const url = `https://wa.me/?text=${textoFormatado}`;
    
    // Mostrar feedback de confirmação
    setShowFeedback(true);
    
    // Esconder o feedback após 2 segundos
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
    
    // Abrir o WhatsApp
    window.open(url, '_blank');
  };

  // Função para abrir o formulário de reflexão
  const abrirFormulario = () => {
    setShowFormulario(true);
  };

  return (
    <div className="carta-container">
      {isVisible && <div className="brilho"></div>}
      <div className="carta-reflexao">
        {categoriaAtual === 'motivacao' && (
          <>
            <button 
              className="compartilhar-whatsapp"
              onClick={compartilharWhatsApp}
              aria-label="Compartilhar no WhatsApp"
              title="Compartilhar no WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            
            {showFeedback && (
              <div className="compartilhar-feedback">
                Mensagem compartilhada! ✓
              </div>
            )}
          </>
        )}
        
        <h2>{getTitulo()}</h2>
        <p>{mensagem}</p>

        {/* Novo botão para salvar no diário */}
        <button
          className="salvar-diario-button"
          onClick={abrirFormulario}
          title="Salvar no diário de reflexões"
        >
          <span className="salvar-diario-icon">📔</span>
          <span className="salvar-diario-text">Registrar no Diário</span>
        </button>
      </div>

      {/* Formulário para salvar reflexão */}
      {showFormulario && (
        <FormularioReflexao onClose={() => setShowFormulario(false)} />
      )}
    </div>
  );
};

export default CartaReflexao;