const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cardAPI', {
  loadCards: () => ipcRenderer.invoke('get-card-data'),
  saveCards: (dataset) => ipcRenderer.invoke('save-card-data', { dataset }),
  updateLightColor: (id, color) => ipcRenderer.invoke('update-traffic-light-color', { id, color })
});