import { WebPlugin } from '@capacitor/core';

export class AudioPluginWeb extends WebPlugin {
  constructor() {
    super({
      name: 'AudioPlugin',
    });
  }

  async setAudioMode(options) {
    return {
      success: true
    };
  }

  async playAudio(options) {
    // Implementação web simples
    try {
      const audio = new Audio(options.url);
      audio.play();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}