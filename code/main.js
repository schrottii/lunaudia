// ELECTRON
const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const mm = require("music-metadata");

global.shared = {};

let mainWindow;
let isDebug = false;

global.shared.getSubdirsAllowed = () => { return false; }

global.shared.getMetadata = async (filePath, fileName) => {
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

const folderPathAudio = isDebug
    ? path.join(__dirname, "audio")
    : path.join(path.dirname(process.execPath.replace(/\\[^\\]+$/, "")), "audio");
const folderPathStorage = isDebug
    ? path.join(__dirname, "storage")
    : path.join(path.dirname(process.execPath.replace(/\\[^\\]+$/, "")), "storage");

global.shared.folderPathAudio = folderPathAudio;
global.shared.folderPathStorage = folderPathStorage;

var audioFolders = [
    folderPathAudio,
    path.join(process.env.USERPROFILE || "", "Music"),
];

const allowedAudioExtensions = [".mp3", ".ogg", ".wav", ".flac", ".m4a"];
const allowedImageExtensions = [".png", ".jpg"];

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
            if (allowSub) results.push(...getSubfolders(fullPath, allowedExtensions, global.shared.getSubdirsAllowed(fullPath)));
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

function getAudioFiles() {
    let files = [];
    let cover = [];

    if (!fs.existsSync(folderPathAudio)) return []; // folder does not exist

    // add folder-wide cover art
    try {
        cover = fs.readdirSync(folderPathAudio)
            .filter(file => allowedImageExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => path.join(folderPathAudio, file));

        if (cover.length > 0) {
            let img = new Image();
            img.src = cover[0];
            img.onload = () => {
                images["cover"] = img;
            }
        }
        else {
            images.cover = images.placeholderCover;
        }
    }
    catch (err) {
        console.error("Error reading image folder:", err);
    }

    // add audio files
    let found;
    for (let folder of audioFolders) {
        //console.log(folder, fs.existsSync(folder))
        if (!folder || !fs.existsSync(folder)) continue; // skip folder if faulty

        try {
            found = getSubfolders(folder, allowedAudioExtensions, global.shared.getSubdirsAllowed(folder));
            files.push(...found);
        } catch (err) {
            console.error("Error scanning folder:", folder, err);
        }
    }

    return files;
}



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 960,
        icon: "images/icon.ico",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.setMenuBarVisibility(isDebug);
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

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
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

/*
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
*/