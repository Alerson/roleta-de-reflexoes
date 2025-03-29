import React, { useState } from 'react';
import './ConsentimentoPrivacidade.css';

const ConsentimentoPrivacidade = ({ onConsent }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleConsent = () => {
    localStorage.setItem('privacyConsent', 'true');
    if (onConsent) onConsent();
  };

  return (
    <div className="consentimento-overlay">
      <div className="consentimento-card">
        <h2>Política de Privacidade</h2>
        
        <div className="consentimento-content">
          <p>
            Bem-vindo à Roleta de Reflexões! Precisamos do seu consentimento antes de continuar.
          </p>
          
          <p>
            Este aplicativo armazena algumas informações básicas no seu dispositivo, como seu nome 
            e avatar selecionado, para personalizar sua experiência. Nenhuma informação é 
            enviada para servidores externos.
          </p>
          
          {expanded ? (
            <div className="politica-detalhada">
              <h3>Informações Coletadas</h3>
              <p>
                • Nome de usuário<br />
                • Avatar selecionado<br />
                • Preferências de categoria<br />
                • Histórico de uso do aplicativo
              </p>
              
              <h3>Como Usamos Suas Informações</h3>
              <p>
                Utilizamos estas informações apenas para personalizar sua experiência no aplicativo
                e lembrar suas preferências entre sessões.
              </p>
              
              <h3>Armazenamento e Segurança</h3>
              <p>
                Todas as informações são armazenadas localmente no seu dispositivo.
                Não compartilhamos seus dados com terceiros.
              </p>
              
              <h3>Seus Direitos</h3>
              <p>
                Você pode acessar, corrigir ou excluir seus dados a qualquer momento
                através da opção "Limpar todos os dados do perfil" nas configurações.
              </p>
            </div>
          ) : (
            <button className="ver-mais-button" onClick={toggleExpanded}>
              Ver Política Completa
            </button>
          )}
          
          {expanded && (
            <button className="ver-menos-button" onClick={toggleExpanded}>
              Ver Menos
            </button>
          )}
          
          <div className="consentimento-acoes">
            <button className="consentimento-button" onClick={handleConsent}>
              Concordo
            </button>
          </div>
          
          <p className="consentimento-footer">
            Ao clicar em "Concordo", você confirma que leu e aceitou nossa{' '}
            <button 
              className="politica-link-inline"
              onClick={() => setExpanded(true)}
            >
              Política de Privacidade
            </button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentimentoPrivacidade;