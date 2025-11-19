var currentMetadata = undefined;
var imgBase64 = "";

async function loadMetadata(filePath, fileName) {
    let meta = await window.shared.getMetadata(filePath, fileName);
    console.log(meta);
    currentMetadata = meta;
    return true;
}

function base64ToImage(base64) {
    let img = new Image();
    img.src = base64;
    return img;
}

function fetchSongData(type) {
    let noMD = currentMetadata == undefined || currentMetadata.common == undefined || currentMetadata.common[type.toLowerCase()] == undefined;
    switch (type) {
        case "title":
            if (currentSong == undefined) return "";
            if (noMD) return currentSong.split("\\")[currentSong.split("\\").length - 1];
            return searchSongData(type);
        case "artist":
            if (noMD) return "";
            return " - " + searchSongData(type);
        case "picture":
            if (noMD || currentMetadata.common.picture == undefined) return "cover";
            let picture = currentMetadata.common.picture[0];
            let mime = picture.format || "image/jpeg";

            imgBase64 = `data:${mime};base64,${picture.data.toString('base64')}`;
            images["coverMD"] = base64ToImage(imgBase64);
            return "coverMD";
    }
}

function searchSongData(type) {
    let md = currentMetadata.common;

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

async function updateMusicMetadata() {
    let loadedMD = await loadMetadata(currentSong, "");

    if (loadedMD) {
        objects["infoText2"].text = "Track: " + fetchSongData("title") + fetchSongData("artist");
        objects["coverArt"].image = fetchSongData("picture");
        if (currentMetadata != undefined && currentMetadata.common.title != undefined) objects["metadataStatus"].power = true;
    }
}