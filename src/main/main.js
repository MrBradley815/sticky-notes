const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');

const configPath = path.join(__dirname, './config.json');
const rawData = fs.readFileSync(configPath);
const config = JSON.parse(rawData);

let win;
const noteList = [];

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // width: 476,
    // height: 438,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('src/renderer/index.html');
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('config-settings', config);
  });
};

app.on('ready', () => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on('create-note', createNote);
  ipcMain.on('delete-note', deleteNote);
  ipcMain.on('save-config-settings', saveConfigSettings);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function createNote(e, options) {
  try {
    const note = new BrowserWindow({
      width: options.width,
      height: options.height,
      parent: win,
      useContentSize: true,
      fullscreenable: false,
      skipTaskbar: true,
      frame: false,
      resizable: false,
      roundedCorners: false, // Remove rounded corners on MacOS
      thickFrame: false, // Remove rounded corners on Windows
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    note.loadFile('src/renderer/note.html');

    note.show();

    noteList.push(note);
  } catch (error) {
    console.error('Error creating a note', error);
  }
}

function deleteNote(event) {
  try {
    const sender = BrowserWindow.fromWebContents(event.sender);

    if (sender) {
      const index = noteList.findIndex((note) => note === sender);

      if (index !== -1) {
        noteList.splice(index, 1);
        sender.close();
      }
    }
  } catch (error) {
    console.error('Error updating position', error);
  }
}

function saveConfigSettings(event, settings) {
  try {
    settings = JSON.stringify(settings, null, 2);
    fs.writeFileSync(configPath, settings);
  } catch (error) {
    console.error('Error updating settings', error);
  }
}
