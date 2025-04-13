import { registerPlugin } from '@capacitor/core';

// Registro de um plugin personalizado para gerenciar áudio
const AudioPlugin = registerPlugin('AudioPlugin', {
  web: () => import('./AudioPluginWeb').then(m => new m.AudioPluginWeb()),
});

export default AudioPlugin;