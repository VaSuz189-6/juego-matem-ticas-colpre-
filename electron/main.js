const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { autoUpdater } = require('electron-updater');
const { syncResult } = require('./cloud-sync');

let mainWindow;
let updateState = { status: 'idle' };

function sendUpdateState(payload) {
  updateState = { ...updateState, ...payload };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('updater:state', updateState);
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

  autoUpdater.on('checking-for-update', () => sendUpdateState({ status: 'checking' }));
  autoUpdater.on('update-available', (info) => sendUpdateState({ status: 'available', version: info.version }));
  autoUpdater.on('update-not-available', () => sendUpdateState({ status: 'current' }));
  autoUpdater.on('download-progress', (progress) => sendUpdateState({
    status: 'downloading',
    percent: Math.round(progress.percent)
  }));
  autoUpdater.on('update-downloaded', (info) => sendUpdateState({
    status: 'downloaded',
    version: info.version
  }));
  autoUpdater.on('error', (error) => sendUpdateState({
    status: 'error',
    message: error.message
  }));
}

app.whenReady().then(() => {
  configureUpdater();
  createWindow();

  if (app.isPackaged) {
    setTimeout(() => autoUpdater.checkForUpdates(), 2500);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('updater:get-state', () => updateState);
ipcMain.handle('updater:download', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (error) {
    sendUpdateState({ status: 'error', message: error.message });
    return { ok: false, message: error.message };
  }
});
ipcMain.handle('updater:install', () => {
  autoUpdater.quitAndInstall();
});
ipcMain.handle('updater:check', async () => {
  if (!app.isPackaged) return { ok: false, message: 'Las actualizaciones se prueban en la aplicación instalada.' };
  try {
    await autoUpdater.checkForUpdates();
    return { ok: true };
  } catch (error) {
    sendUpdateState({ status: 'error', message: error.message });
    return { ok: false, message: error.message };
  }
});

ipcMain.handle('app:show-error', (_event, message) => {
  dialog.showErrorBox('Misión Entera', message);
});

ipcMain.handle('cloud:sync-result', (_event, record) => syncResult(record));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
