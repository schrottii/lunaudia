var currentMetadata = undefined;
var imgBase64 = "";

function base64ToImage(base64) {
    let img = new Image();
    img.src = base64;
    return img;
}

function fetchSongData(type, CMD = currentMetadata) {
    let noMD = CMD == undefined || CMD.common == undefined || CMD.common[type.toLowerCase()] == undefined;
    //console.log("no: " + noMD + ", MD: ");
    //console.log(CMD);

    switch (type) {
        case "title":
            if (currentSong == undefined) return "";
            if (noMD) return currentSong.split("\\")[currentSong.split("\\").length - 1];
            return searchSongData(type, CMD);
        case "artist":
            if (noMD) return "";
            return " - " + searchSongData(type, CMD);
        case "picture":
            if (noMD || CMD.common.picture == undefined) return "cover";
            try {
                //console.log(CMD.common);
                let picture = CMD.common.picture[0];
                let title = CMD.common.title;

                if (picture && picture.base64) {
                    imgBase64 = `data:${picture.format};base64,${picture.base64}`;
                    images["cover_" + title] = base64ToImage(imgBase64);
                    return "cover_" + title;
                } else {
                    return "cover";
                }
            }
            catch (e) {
                console.log(e);
                return "cover";
            }
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
    let metadata = await window.lunaudiaAPI.getMetadata(playlist.imageSong); // load or get ?
    if (metadata === undefined || metadata === false) return "cover";
    metadata = JSON.parse(metadata);

    console.log("metadata: " + metadata);

    let playlistCover = fetchSongData("picture", metadata);
    return playlistCover != undefined ? playlistCover : "cover";
}

async function updateMusicMetadata() {
    let loadedMD = await window.lunaudiaAPI.getMetadata(currentSong, "");
    if (loadedMD == undefined || loadedMD == false) return false;
    loadedMD = JSON.parse(loadedMD);
    //console.log(loadedMD);

    if (loadedMD) {
        objects["infoText2"].text = "Track: " + fetchSongData("title", loadedMD) + fetchSongData("artist", loadedMD);
        
        if (currentMetadata != undefined && currentMetadata.common.title != undefined) objects["metadataStatus"].power = true;
    }

    if (getPlaylist(settings.currentPlaylist) != undefined && getPlaylist(settings.currentPlaylist).imageSong != undefined) {
        let loadedCoverArt = await getPlaylistCover();
        if (loadedCoverArt !== undefined) objects["coverArt"].image = loadedCoverArt;
    }
    else if (loadedMD) {
        //console.log("trying to load the song's cover art");
        objects["coverArt"].image = fetchSongData("picture", loadedMD);
    }
    else {
        //console.log("default cover");
        objects["coverArt"].image = "cover";
    }
}