// logger.js
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

// Get the user's home directory
const userHome = app.getPath('home');
const logFilePath = path.join(userHome, 'YourAppName', 'app.log');

// Ensure the log directory exists
const logDirectory = path.dirname(logFilePath);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

export function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}