/**
 * Serviço para gerenciar áudio no aplicativo com melhor suporte para iOS
 */
class AudioService {
  constructor() {
    this.audio = null;
    this.initialized = false;
    this.musicaAtiva = false;
    this.volume = 0.5;
    this.audioContext = null;
    this.source = null;
  }

  /**
   * Inicializa o serviço de áudio com suporte aprimorado para iOS
   * @param {string} src - O caminho para o arquivo de áudio
   */
  init(src = '/musicas/relaxing-background.mp3') {
    if (this.initialized) return;

    try {
      // Criar elemento de áudio com atributos iOS
      this.audio = new Audio(src);
      this.audio.setAttribute('webkit-playsinline', 'true');
      this.audio.setAttribute('playsinline', 'true');
      this.audio.setAttribute('preload', 'auto');
      
      // Propriedades padrão
      this.audio.loop = true;
      this.audio.volume = this.volume;
      
      // Adicionar listeners para problemas comuns
      this.audio.addEventListener('error', (e) => {
        console.error("Erro no elemento de áudio:", e);
      });
      
      // Verificar se o usuário tinha a música ativa anteriormente
      const musicaAtiva = localStorage.getItem('musicaAtiva') === 'true';
      this.musicaAtiva = musicaAtiva;
      console.log('AudioService inicializado, música ativa:', musicaAtiva);
      
      // Marcar como inicializado
      this.initialized = true;
      
      // Em iOS, precisamos iniciar a reprodução dentro de um evento de usuário
      // então não iniciamos automaticamente aqui, apenas se o usuário já
      // havia ativado explicitamente a música antes
      if (musicaAtiva) {
        // Ainda tentamos com um delay, mas isso pode não funcionar em iOS
        // até que haja uma interação do usuário
        setTimeout(() => {
          this.playWithErrorHandling();
        }, 1000);
      }

      // Adicionar listener para eventos de visibilidade da página
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.musicaAtiva) {
          this.playWithErrorHandling();
        } else if (document.visibilityState === 'hidden') {
          // Em iOS, a música será pausada automaticamente em segundo plano
          // a menos que habilidades de áudio em segundo plano estejam configuradas
        }
      });
    } catch (error) {
      console.error("Erro ao inicializar serviço de áudio:", error);
      this.initialized = true; // Marcar como inicializado mesmo com erro
    }
  }

  /**
   * Tenta reproduzir áudio usando várias técnicas para contornar restrições de iOS
   */
  playWithErrorHandling() {
    if (!this.audio) return;
    
    try {
      // Método principal para reprodução
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.musicaAtiva = true;
            localStorage.setItem('musicaAtiva', 'true');
            this._notifyStateChange(true);
            console.log('Reprodução de áudio bem-sucedida');
          })
          .catch(error => {
            console.error("Erro ao reproduzir áudio:", error);
            // Tentar uma abordagem alternativa para iOS
            this.tryAlternativePlay();
          });
      }
    } catch (error) {
      console.error("Exceção ao reproduzir áudio:", error);
      this.tryAlternativePlay();
    }
  }

  /**
   * Tenta uma abordagem alternativa para reproduzir áudio em iOS
   */
  tryAlternativePlay() {
    try {
      // Verificar se o Web Audio API está disponível
      if (window.AudioContext || window.webkitAudioContext) {
        if (!this.audioContext) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContextClass();
        }
        
        // Em iOS, precisamos "desbloquear" o áudio com uma interação de usuário
        // Este código tenta simular isso em um contexto diferente
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            console.log('AudioContext resumido com sucesso');
          });
        }
        
        // Se já temos um elemento de áudio, podemos tentar conectá-lo
        // ao Web Audio API como uma fonte alternativa
        if (!this.source && this.audio) {
          this.source = this.audioContext.createMediaElementSource(this.audio);
          this.source.connect(this.audioContext.destination);
        }
        
        // Tente novamente com o elemento de áudio
        this.audio.play()
          .then(() => {
            this.musicaAtiva = true;
            localStorage.setItem('musicaAtiva', 'true');
            this._notifyStateChange(true);
            console.log('Reprodução alternativa bem-sucedida');
          })
          .catch(e => console.error('Falha na segunda tentativa:', e));
      }
    } catch (error) {
      console.error("Erro na reprodução alternativa:", error);
      this.musicaAtiva = false;
      this._notifyStateChange(false);
    }
  }

  /**
   * Reproduz o áudio
   */
  play() {
    if (!this.initialized) {
      this.init();
      return;
    }

    this.playWithErrorHandling();
    return true; // Indica tentativa de iniciar a reprodução
  }

  /**
   * Pausa o áudio com tratamento de erros
   */
  pause() {
    if (!this.audio) return false;
    
    try {
      this.audio.pause();
      this.musicaAtiva = false;
      localStorage.setItem('musicaAtiva', 'false');
      this._notifyStateChange(false);
      console.log('Áudio pausado com sucesso');
      return true; // Sucesso ao pausar
    } catch (error) {
      console.error("Erro ao pausar áudio:", error);
      return false; // Falha ao pausar
    }
  }

  /**
   * Alterna entre tocar e pausar a música
   * @returns {boolean} - O novo estado (true = tocando, false = pausado)
   */
  toggle() {
    console.log('Solicitação de toggle, estado atual:', this.musicaAtiva);
    const result = this.musicaAtiva ? this.pause() : this.play();
    
    // Para play(), result será true indicando tentativa iniciada
    // Para pause(), result será true se pausou com sucesso, false se falhou
    
    // Quando pausamos, o estado já foi atualizado em pause()
    // Quando tocamos, a atualização acontece na promise em playWithErrorHandling()
    
    // Retorna o novo estado esperado
    return this.musicaAtiva;
  }

  /**
   * Define o volume do áudio
   * @param {number} value - O valor do volume (entre 0 e 1)
   */
  setVolume(value) {
    if (value >= 0 && value <= 1) {
      this.volume = value;
      
      if (this.audio) {
        try {
          this.audio.volume = this.volume;
        } catch (error) {
          console.error("Erro ao ajustar volume:", error);
        }
      }
    }
  }

  /**
   * Verifica se a música está tocando
   * @returns {boolean} - true se a música estiver tocando, false caso contrário
   */
  isPlaying() {
    // Além de verificar o estado interno, verificamos também o estado real do elemento de áudio
    if (this.audio) {
      try {
        // Combinamos o estado armazenado com o estado real do elemento
        return this.musicaAtiva || (!this.audio.paused && !this.audio.ended);
      } catch (error) {
        console.error("Erro ao verificar estado de reprodução:", error);
      }
    }
    return this.musicaAtiva;
  }

  /**
   * Notifica outros componentes sobre mudanças no estado do áudio
   * @private
   * @param {boolean} isPlaying - O novo estado de reprodução
   */
  _notifyStateChange(isPlaying) {
    try {
      const event = new CustomEvent('audioStateChange', { 
        detail: { isPlaying: isPlaying } 
      });
      document.dispatchEvent(event);
      console.log('Evento audioStateChange disparado:', isPlaying);
    } catch (error) {
      console.error("Erro ao notificar mudança de estado:", error);
    }
  }

  /**
   * Limpa recursos do serviço de áudio
   */
  cleanup() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.src = '';
        
        // Remover event listeners
        this.audio.removeEventListener('error', () => {});
        document.removeEventListener('visibilitychange', () => {});
        
        this.audio = null;
      } catch (error) {
        console.error("Erro ao limpar recursos de áudio:", error);
      }
    }
    
    // Limpar contexto de áudio
    if (this.audioContext) {
      try {
        this.audioContext.close();
        this.audioContext = null;
      } catch (error) {
        console.error("Erro ao fechar AudioContext:", error);
      }
    }
    
    this.source = null;
    this.initialized = false;
  }
}

// Exporta uma única instância do serviço
const audioService = new AudioService();
export default audioService;