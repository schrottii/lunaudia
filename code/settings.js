//const path = require("path");
//const fs = require("fs");

var settings = {
    volume: 0.5,
    currentPlaylist: "",
}

function createStorage() {
    let folderPathStorage = global.shared.folderPathStorage;
    let folderPathAudio = global.shared.folderPathAudio;

    if (!fs.existsSync(folderPathAudio)) {
        fs.mkdir(folderPathAudio, () => { });
    }
    if (!fs.existsSync(folderPathStorage)) {
        fs.mkdir(folderPathStorage, () => { });
    }

    if (!fs.existsSync(path.join(folderPathStorage, "settings.json"))) {
        saveSettings();
    }

    if (!fs.existsSync(path.join(folderPathStorage, "paths.json"))) {
        savePaths();
    }
}

function savePaths() {
    let folderPathStorage = global.shared.folderPathStorage;

    fs.writeFile(path.join(folderPathStorage, "paths.json"), JSON.stringify(audioFolders, null, 2), () => { });
}

function loadPaths() {
    let folderPathStorage = global.shared.folderPathStorage;
    if (!fs.existsSync(path.join(folderPathStorage, "paths.json"))) return false;
    fs.readFile(path.join(folderPathStorage, "paths.json"), "utf-8", (err, data) => { audioFolders = JSON.parse(data); });
}

function saveSettings() {
    let folderPathStorage = global.shared.folderPathStorage;

    fs.writeFile(path.join(folderPathStorage, "settings.json"), JSON.stringify(settings, null, 2), () => { });
}

function loadSettings() {
    let folderPathStorage = global.shared.folderPathStorage;
    if (!fs.existsSync(path.join(folderPathStorage, "settings.json"))) return false;
    fs.readFile(path.join(folderPathStorage, "settings.json"), "utf-8", (err, data) => { settings = JSON.parse(data); });

    wggjAudio.volume = settings.volume;
}

function savePlaylists() {
    let folderPathStorage = global.shared.folderPathStorage;

    fs.writeFile(path.join(folderPathStorage, "playlists.json"), JSON.stringify(playlists, null, 2), () => { });
}

function loadPlaylists() {
    let folderPathStorage = global.shared.folderPathStorage;
    if (!fs.existsSync(path.join(folderPathStorage, "playlists.json"))) {
        savePlaylists();
        return false;
    }
    fs.readFile(path.join(folderPathStorage, "playlists.json"), "utf-8", (err, data) => {
        let rawPlaylists = JSON.parse(data);
        let rp;
        playlists = [];
        for (let r in rawPlaylists) {
            rp = rawPlaylists[r];
            playlists.push(new Playlist(rp.type, rp.name, [], rp));
            playlists[playlists.length - 1].getImage();
        }
    });
}

createStorage();
loadPaths();
loadSettings();
loadPlaylists();