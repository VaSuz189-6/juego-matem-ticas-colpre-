const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('misionDesktop', {
  updater: {
    getState: () => ipcRenderer.invoke('updater:get-state'),
    check: () => ipcRenderer.invoke('updater:check'),
    download: () => ipcRenderer.invoke('updater:download'),
    install: () => ipcRenderer.invoke('updater:install'),
    onState: (callback) => {
      const listener = (_event, state) => callback(state);
      ipcRenderer.on('updater:state', listener);
      return () => ipcRenderer.removeListener('updater:state', listener);
    }
  },
  cloud: {
    syncResult: (record) => ipcRenderer.invoke('cloud:sync-result', record)
  }
});
