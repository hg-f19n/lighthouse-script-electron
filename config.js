import fs from 'fs';
import path from 'path';
import { app } from 'electron';

let baseDirectory = '';

export function setBaseDirectory(directory) {
    baseDirectory = directory;
    saveConfig();
}

export function getBaseDirectory() {
    return baseDirectory;
}

function getConfigFilePath() {
    const appDataPath = app.getPath('userData'); // Main app directory
    return path.join(appDataPath, 'config.json');
}

function saveConfig() {
    const config = {
        baseDirectory: baseDirectory
    };
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(config));
}

export function loadConfig() {
    const configFilePath = getConfigFilePath();
    if (fs.existsSync(configFilePath)) {
        const config = JSON.parse(fs.readFileSync(configFilePath));
        baseDirectory = config.baseDirectory;
    }
}
