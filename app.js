const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.handle('get-images', (event, folderPath) => {
    const files = fs.readdirSync(folderPath);
    return files.filter(file => ['.png'].includes(path.extname(file).toLowerCase()));
});

ipcMain.handle('rename-image', (event, folderPath, oldName, newName) => {
    const oldPath = path.join(folderPath, oldName);
    const newPath = path.join(folderPath, newName);
    fs.renameSync(oldPath, newPath);
});

ipcMain.handle('validate-filename', (event, newName) => {
    // Regular expression to match filenames with exactly 6 characters, only lowercase letters, digits, and no ñ
    const validFilenameRegex = /^[a-z0-9]{6}$/;
    return validFilenameRegex.test(newName) && !newName.includes('ñ');
});

