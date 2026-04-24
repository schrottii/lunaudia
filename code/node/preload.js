const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lunaudiaAPI', {
    // new
    updateDiscord: (song = "", artist = "") => ipcRenderer.invoke('discord-update', song, artist),
    pathome: (pp = "") => ipcRenderer.invoke('pathome', pp),

    // sharing functions
    getAudioFiles: (audioFolders = []) => ipcRenderer.invoke('storage-action', 'getAudioFiles', audioFolders),
    loadMetadata: (filePath, fileName = "") => ipcRenderer.invoke('storage-action', 'loadMetadata', filePath, fileName),
    saveSettings: (data = []) => ipcRenderer.invoke('storage-action', 'saveSettings', data),
    createStorage: (data = []) => ipcRenderer.invoke('storage-action', 'createStorage', data),
    loadPaths: () => ipcRenderer.invoke('storage-action', 'loadPaths'),
    savePaths: (audioFolders = []) => ipcRenderer.invoke('storage-action', 'savePaths', audioFolders),
    savePlaylists: (playlists = []) => ipcRenderer.invoke('storage-action', 'savePlaylists', playlists),
    loadPlaylists: (playlists = []) => ipcRenderer.invoke('storage-action', 'loadPlaylists', playlists),

    // variables
    getFolderPathAudio: () => ipcRenderer.invoke('get-folder-path-audio'),

    // other way around
    onExecuteAction: (callback) => ipcRenderer.on('execute-ui-action', (event, data) => callback(data))
});