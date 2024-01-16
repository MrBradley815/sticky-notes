const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
  configSettings: (settings) => {
    ipcRenderer.on('config-settings', settings);
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  createNote: (options) => {
    ipcRenderer.send('create-note', options);
  },
  deleteNote: () => {
    ipcRenderer.send('delete-note');
  },
  saveConfigSettings: (settings) => {
    ipcRenderer.send('save-config-settings', settings);
  },
});
