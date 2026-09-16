const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let updateState = { status: 'idle' };

function publishState(state) {
  updateState = { ...updateState, ...state };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:state', updateState);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: '#060a1f',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'html', 'menu.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

function configureUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => publishState({ status: 'checking' }));
  autoUpdater.on('update-available', (info) => publishState({ status: 'available', version: info.version }));
  autoUpdater.on('update-not-available', () => publishState({ status: 'current' }));
  autoUpdater.on('download-progress', (progress) => publishState({ status: 'downloading', percent: Math.round(progress.percent) }));
  autoUpdater.on('update-downloaded', (info) => publishState({ status: 'downloaded', version: info.version }));
  autoUpdater.on('error', (error) => publishState({ status: 'error', message: error.message }));
}

app.whenReady().then(() => {
  configureUpdater();
  createWindow();
  if (app.isPackaged) setTimeout(() => autoUpdater.checkForUpdates(), 2500);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('update:get-state', () => updateState);
ipcMain.handle('update:check', async () => {
  if (!app.isPackaged) return { ok: false, message: 'Las actualizaciones se prueban en el instalador de Windows.' };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    publishState({ status: 'error', message: error.message });
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('update:download', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    publishState({ status: 'error', message: error.message });
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('update:install', () => autoUpdater.quitAndInstall());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
