var currentMetadata = undefined;
var imgBase64 = "";

async function getMetadata(filePath, fileName = "") {
    let meta = await window.shared.getMetadata(filePath, fileName);
    //console.log(meta);
    return meta;
}

async function loadMetadata(filePath, fileName = "") {
    currentMetadata = await getMetadata(filePath, fileName);
    return currentMetadata;
}

function base64ToImage(base64) {
    let img = new Image();
    img.src = base64;
    return img;
}

function fetchSongData(type, CMD = currentMetadata) {
    let noMD = CMD == undefined || CMD.common == undefined || CMD.common[type.toLowerCase()] == undefined;
    switch (type) {
        case "title":
            if (currentSong == undefined) return "";
            if (noMD) return currentSong.split("\\")[currentSong.split("\\").length - 1];
            return searchSongData(type);
        case "artist":
            if (noMD) return "";
            return " - " + searchSongData(type);
        case "picture":
            if (noMD || CMD.common.picture == undefined) return "cover";
            let picture = CMD.common.picture[0];
            let mime = picture.format || "image/jpeg";

            imgBase64 = `data:${mime};base64,${picture.data.toString('base64')}`;
            images["cover_" + CMD.common.title] = base64ToImage(imgBase64);
            return "cover_" + CMD.common.title;
    }
}

function searchSongData(type, CMD = currentMetadata) {
    let md = CMD.common;

    return md[type.toLowerCase()];
}

/*
function searchSongData(type) {
    let md = currentMetadata.native.vorbis;

    for (let t in md) {
        if (md[t].id == type.toUpperCase()) return md[t].value;
    }
}
*/

async function getPlaylistCover(playlist = getPlaylist(settings.currentPlaylist)) {
    let playlistCover = await getMetadata(playlist.imageSong);
    playlistCover = fetchSongData("picture", playlistCover);
    return playlistCover != undefined ? playlistCover : "cover";
}

async function updateMusicMetadata() {
    let loadedMD = await loadMetadata(currentSong, "");

    if (loadedMD) {
        objects["infoText2"].text = "Track: " + fetchSongData("title") + fetchSongData("artist");
        
        if (currentMetadata != undefined && currentMetadata.common.title != undefined) objects["metadataStatus"].power = true;
    }

    if (getPlaylist(settings.currentPlaylist).imageSong) {
        objects["coverArt"].image = await getPlaylistCover();
    }
    else if (loadedMD) objects["coverArt"].image = fetchSongData("picture");
    else objects["coverArt"].image = "cover";
}