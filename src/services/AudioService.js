/**
 * Serviço para gerenciar áudio no aplicativo
 */
class AudioService {
    constructor() {
      this.audio = null;
      this.initialized = false;
      this.musicaAtiva = false;
      this.volume = 0.5;
    }
  
    /**
     * Inicializa o serviço de áudio
     * @param {string} src - O caminho para o arquivo de áudio
     */
    init(src = '/musicas/relaxing-background.mp3') {
      if (this.initialized) return;
  
      this.audio = new Audio(src);
      this.audio.loop = true;
      this.audio.volume = this.volume;
      
      // Verificar se o usuário tinha a música ativa anteriormente
      const musicaAtiva = localStorage.getItem('musicaAtiva') === 'true';
      this.musicaAtiva = musicaAtiva;
      
      if (musicaAtiva) {
        this.play();
      }
      
      this.initialized = true;
    }
  
    /**
     * Reproduz o áudio
     */
    play() {
      if (!this.initialized) {
        this.init();
      }
  
      if (this.audio) {
        try {
          const playPromise = this.audio.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Erro ao reproduzir áudio:", error);
            });
          }
          
          this.musicaAtiva = true;
          localStorage.setItem('musicaAtiva', 'true');
        } catch (error) {
          console.error("Erro ao reproduzir áudio:", error);
        }
      }
    }
  
    /**
     * Pausa o áudio
     */
    pause() {
      if (this.audio) {
        this.audio.pause();
        this.musicaAtiva = false;
        localStorage.setItem('musicaAtiva', 'false');
      }
    }
  
    /**
     * Alterna entre tocar e pausar a música
     * @returns {boolean} - O novo estado (true = tocando, false = pausado)
     */
    toggle() {
      if (this.musicaAtiva) {
        this.pause();
      } else {
        this.play();
      }
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
          this.audio.volume = this.volume;
        }
      }
    }
  
    /**
     * Verifica se a música está tocando
     * @returns {boolean} - true se a música estiver tocando, false caso contrário
     */
    isPlaying() {
      return this.musicaAtiva;
    }
  }
  
  // Exporta uma única instância do serviço
  const audioService = new AudioService();
  export default audioService;