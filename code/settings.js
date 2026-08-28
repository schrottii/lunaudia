var settings = {
    volume: 0.5,
    currentPlaylist: "",
    mono: "stereo"
}

var audioFolders = [];

function getSubdirsAllowed(path) {
    if (getPlaylist(settings.currentPlaylist) == undefined) return true;
    if (getPlaylist(settings.currentPlaylist).pathSettings == undefined) return true;
    if (getPlaylist(settings.currentPlaylist).pathSettings[path] == undefined) return true;
    return getPlaylist(settings.currentPlaylist).pathSettings[path].subdirs;
}

window.lunaudiaAPI.createStorage(settings);
async function loadData() {
    //console.log(audioFolders);
    audioFolders[0] = await window.lunaudiaAPI.getFolderPathAudio();
    audioFolders[1] = await window.lunaudiaAPI.pathome("Music");
    //console.log(audioFolders);

    /*
    let pathLoader = await window.lunaudiaAPI.loadPaths();
    if (pathLoader !== false && pathLoader !== undefined) {
        audioFolders = pathLoader;
        console.log(audioFolders);
    }
    console.log(audioFolders);
    */

    //console.log(playlists, playlist);

    let loadedPlaylists = await window.lunaudiaAPI.loadPlaylists(JSON.stringify(playlists));
    //console.log(loadedPlaylists);
    loadedPlaylists = JSON.parse(loadedPlaylists);
    //console.log(loadedPlaylists);

    let rp;
    for (let r in loadedPlaylists) {
        rp = loadedPlaylists[r];
        if (rp.name == "Local") continue;
        //console.log(r, rp);
        playlists.push(new Playlist(rp.type, rp.name, [], rp));
        playlists[playlists.length - 1].getImage();
    }
    //console.log(playlists, playlist);

    let loadedFiles = await window.lunaudiaAPI.getAudioFiles(JSON.stringify(audioFolders));
    playlist = JSON.parse(loadedFiles);// [loadedFiles.substr(1).substr(0, loadedFiles.length - 1)];
    //console.log(playlists, playlist);

    prepareLocalPlaylist(audioFolders);
}
loadData();