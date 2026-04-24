// ELECTRON
const { app, BrowserWindow, shell, ipcMain } = require("electron");

const path = require("path");
const fs = require("fs");
const mm = require("music-metadata");

const { storage, isDebug, folderPathAudio, saveSettings, createStorage, savePaths, loadPaths, savePlaylists, loadPlaylists } = require('./storage');
const { discordClientConnect, updateDiscordPresence } = require('./discord');

function contactFront(fun, data) {
    mainWindow.webContents.send('execute-ui-action', { fun: fun, data: data });
}

ipcMain.handle('storage-action', async (event, action, data) => {
    switch (action) {
        case 'getAudioFiles':
            return getAudioFiles(data);
        case 'loadMetadata':
            return loadMetadata(data);
        case 'saveSettings':
            return saveSettings(data);
        case 'createStorage':
            return createStorage(data);
        case 'loadPaths':
            return loadPaths();
        case 'savePaths':
            return savePaths(data);
        case 'savePlaylists':
            return savePlaylists(data);
        case 'loadPlaylists':
            return loadPlaylists(data);
        default:
            throw new Error("unknown ipc action");
    }
});

ipcMain.handle('discord-update', async (event, data) => {
    updateDiscordPresence(...data);
});
ipcMain.handle('get-folder-path-audio', async () => {
    return folderPathAudio;
});
ipcMain.handle('pathome', async (event, data) => {
    return pathome(data);
});

let mainWindow;

const allowedAudioExtensions = [".mp3", ".flac", ".ogg", ".wav", ".m4a", ".aac", ".m4r", ".opus", ".webm"];
const allowedImageExtensions = [".png", ".jpg", ".jpeg", ".jpe", ".jfif", ".exif", ".avif", ".gif", ".agif", ".bmp", ".dib", ".rle", ".tga"];

async function getMetadata(filePath, fileName) {
    if (!fs.existsSync(filePath)) {
        //console.log(filePath);
        return false;
    }

    try {
        const metadata = await mm.parseFile(path.join(filePath, fileName));
        return metadata;
    } catch (err) {
        console.error(filePath + ", " + fileName);
        console.error("Metadata error:", err);

        //throw err;
        return undefined;
    }
};

async function loadMetadata(filePath, fileName = "") {
    currentMetadata = await getMetadata(filePath, fileName);
    return currentMetadata;
}

function pathome(pp = "") {
    if (pp === undefined) pp = "";
    return path.join(process.env.USERPROFILE || '', pp);
}

function getSubfolders(folder, allowedExtensions, allowSub = true) {
    if (!fs.existsSync(folder)) return [];

    let results = [];
    let entries = fs.readdirSync(folder);
    let fullPath;
    let stat;

    for (let entry of entries) {
        fullPath = path.join(folder, entry);
        stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // folder (recursion, hell yeah)
            if (allowSub) results.push(...getSubfolders(fullPath, allowedExtensions, contactFront("getSubdirsAllowed", fullPath)));
        }
        else {
            // file
            if (allowedExtensions.includes(path.extname(entry).toLowerCase())) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

function getAudioFiles(audioFolders = "") {
    audioFolders = JSON.parse(audioFolders);
    let files = [];
    let cover = [];

    // add folder-wide cover art
    if (fs.existsSync(folderPathAudio)) {
        try {
            cover = fs.readdirSync(folderPathAudio)
                .filter(file => allowedImageExtensions.includes(path.extname(file).toLowerCase()))
                .map(file => path.join(folderPathAudio, file));

            if (cover.length > 0) {
                contactFront("setCover", JSON.stringify(cover[0]));
                /*
                let img = new Image();
                img.src = cover[0];
                img.onload = () => {
                    images["cover"] = img;
                }
                */
            }
            else {
                contactFront("setCoverPlaceHolder");
                //images.cover = images.placeholderCover;
            }
        }
        catch (err) {
            console.error("Error reading image folder:", err);
        }
    }

    // add audio files
    let found;
    for (let folder of audioFolders) {
        //console.log(folder, fs.existsSync(folder))
        if (!folder || !fs.existsSync(folder)) continue; // skip folder if faulty

        try {
            found = getSubfolders(folder, allowedAudioExtensions, contactFront("getSubdirsAllowed", folder));
            files.push(...found);
        } catch (err) {
            console.error("Error scanning folder:", folder, err);
        }
    }

    return JSON.stringify(files);
}



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 960,
        icon: "assets/textures/icon/icon.ico",
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    mainWindow.setMenuBarVisibility(true);// isDebug);
    mainWindow.loadFile(path.join(__dirname, "../../index.html"));

    // open only http and https links in external browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' }; // allow local/internal stuff
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(async () => {
    //if (app.isPackaged) isDebug = true;
    createWindow();

    discordClientConnect();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

/*
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
*/