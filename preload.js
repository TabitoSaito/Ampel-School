const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cardAPI', {
  loadCards: () => ipcRenderer.invoke('get-card-data'),
  saveCards: (dataset) => ipcRenderer.invoke('save-card-data', { dataset })
});