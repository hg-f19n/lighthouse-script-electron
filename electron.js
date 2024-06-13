import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { main, startServer } from './main.js';
import { log } from './logger.js';
import { setBaseDirectory, loadConfig, getBaseDirectory } from './config.js'; // Import the shared config module

let mainWindow;

async function promptForDirectory() {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) {
        throw new Error('No directory selected');
    }
    return result.filePaths[0];
}

async function initializeApp() {
    loadConfig(); // Load configuration if it exists
    let baseDirectory = getBaseDirectory();

    if (!baseDirectory) {
        baseDirectory = await promptForDirectory();
        setBaseDirectory(baseDirectory);
    }

    await main();
    await startServer(); // Ensure the server starts before creating the window
    createWindow();
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load the URL of the Express server
    const url = 'http://localhost:3000'; // Make sure the port matches with the Express server
    mainWindow.loadURL(url);

    // Open the DevTools for debugging
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

// Call the main function from main.js to start the Express server and other initializations
app.on('ready', async () => {
    try {
        log('App starting...');
        await initializeApp();
    } catch (error) {
        console.error('Error during startup:', error);
        app.quit();
    }
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On macOS, re-create a window if the app is activated and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
