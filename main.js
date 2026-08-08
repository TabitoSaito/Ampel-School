import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

if (!store.has('cardData')) {
  store.set('cardData', []);
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

ipcMain.handle('save-card-data', async (event, { dataset }) => {
  store.set('cardData', dataset);
  console.log(dataset);
  return { success: true };
});

ipcMain.handle('update-traffic-light-color', async (event, { id, color }) => {
  let cards = store.get('cardData', []);
  id = id.split("-").at(-1)

  const card = cards.find(a => a.id == id);

  if (card) {
    card.lastState = color;
    store.set('cardData', cards);
  }
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