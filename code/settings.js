//const path = require("path");
//const fs = require("fs");

var settings = {
    volume: 0.5,
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

    fs.readFile(path.join(folderPathStorage, "paths.json"), "utf-8", (err, data) => { audioFolders = JSON.parse(data); });
}

function saveSettings() {
    let folderPathStorage = global.shared.folderPathStorage;

    fs.writeFile(path.join(folderPathStorage, "settings.json"), JSON.stringify(settings, null, 2), () => { });
}

function loadSettings() {
    let folderPathStorage = global.shared.folderPathStorage;

    fs.readFile(path.join(folderPathStorage, "settings.json"), "utf-8", (err, data) => { settings = JSON.parse(data); });

    wggjAudio.volume = settings.volume;
}

createStorage();
loadPaths();
loadSettings();