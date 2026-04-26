const path = require("path");
const fs = require("fs");

const isDebug = true;

const folderPathAudio = isDebug
    ? path.join(__dirname, "../../audio")
    : path.join(path.dirname(process.execPath.replace(/\\[^\\]+$/, "")), "audio");
const folderPathStorage = isDebug
    ? path.join(__dirname, "../../storage")
    : path.join(path.dirname(process.execPath.replace(/\\[^\\]+$/, "")), "storage");

function createStorage(data) {
    if (!fs.existsSync(folderPathAudio)) {
        fs.mkdir(folderPathAudio, () => { });
    }
    if (!fs.existsSync(folderPathStorage)) {
        fs.mkdir(folderPathStorage, () => { });
    }

    if (!fs.existsSync(path.join(folderPathStorage, "settings.json"))) {
        saveSettings(data);
    }

    if (!fs.existsSync(path.join(folderPathStorage, "paths.json"))) {
        savePaths();
    }
}

function savePaths(audioFolders = "[]") {
    audioFolders = JSON.parse(audioFolders);
    fs.writeFile(path.join(folderPathStorage, "paths.json"), JSON.stringify(audioFolders, null, 2), () => { });
}

function loadPaths() {
    // deprecated?
    if (!fs.existsSync(path.join(folderPathStorage, "paths.json"))) return false;
    let data = fs.readFileSync(path.join(folderPathStorage, "paths.json"), "utf-8");
    return JSON.stringify(data);
}

function saveSettings(data) {
    fs.writeFile(path.join(folderPathStorage, "settings.json"), JSON.stringify(data, null, 2), () => { });
}

function loadSettings() {
    if (!fs.existsSync(path.join(folderPathStorage, "settings.json"))) return false;
    fs.readFileSync(path.join(folderPathStorage, "settings.json"), "utf-8", (err, data) => { settings = JSON.parse(data); });

    //wggjAudio.volume = settings.volume;
}

function savePlaylists(playlists) {
    fs.writeFile(path.join(folderPathStorage, "playlists.json"), JSON.stringify(playlists, null, 2), () => { });
}

function loadPlaylists(playlists) {
    playlists = JSON.parse(playlists); // fallback

    if (!fs.existsSync(path.join(folderPathStorage, "playlists.json"))) {
        // playlists file doesn't exist, write default (local playlist) into it
        savePlaylists(playlists);
        return JSON.stringify(playlists);
    }
    return fs.readFileSync(path.join(folderPathStorage, "playlists.json"), "utf-8", (err, data) => {
        // load playlist file
        data = data.replaceAll("\\", "/");
        return JSON.stringify(data);
    });
}

loadSettings();

module.exports = {
    saveSettings,
    createStorage,
    savePaths,
    loadPaths,
    savePlaylists,
    loadPlaylists,

    folderPathAudio,
    folderPathStorage,
    isDebug
};