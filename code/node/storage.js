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

function savePaths(audioFolders = []) {
    fs.writeFile(path.join(folderPathStorage, "paths.json"), JSON.stringify(audioFolders, null, 2), () => { });
}

function loadPaths() {
    if (!fs.existsSync(path.join(folderPathStorage, "paths.json"))) return false;
    let data = fs.readFileSync(path.join(folderPathStorage, "paths.json"), "utf-8");
    return JSON.parse(data);
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
    playlists = JSON.parse(playlists);

    if (!fs.existsSync(path.join(folderPathStorage, "playlists.json"))) {
        savePlaylists(playlists);
        return JSON.stringify(playlists);
    }
    fs.readFileSync(path.join(folderPathStorage, "playlists.json"), "utf-8", (err, data) => {
        let rawPlaylists = JSON.parse(data);
        let rp;
        playlists = [];

        for (let r in rawPlaylists) {
            rp = rawPlaylists[r];
            playlists.push(new Playlist(rp.type, rp.name, [], rp));
            playlists[playlists.length - 1].getImage();
        }
    });
    return JSON.stringify(playlists);
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