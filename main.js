import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

store.clear()

if (!store.has('cardData')) {
  store.set('cardData', [{ id: 1, firstName: 'Max', lastName: 'Mustermann', lastState: 'red' }, { id: 2, firstName: 'Max', lastName: 'Gertrude', lastState: 'red' }]);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('src/index.html');
};

ipcMain.handle('get-card-data', () => {
  return store.get('cardData', [{ id: '', firstName: '', lastName: '', lastState: '' }]);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});