var playlist = [];
var playlistP = 0;
var currentSong = "";
var started = false;
var timer = 0;

var repeat = false;
var shuffle = false;

//var mono = "stereo";

wggjAudio.onended = () => {
    if (playlistP < playlist.length - 1) {
        nextSong();
        updatePlayingSong();
    }
    else {
        playlistP = 0;
        updatePlayingSong();
    }
}

wggjAudio.oncanplay = () => {
    wggjAudio.volume = settings.volume;
    //console.log(wggjAudio);
    if (started && wggjAudio.src != undefined) wggjAudio.play();
}

function nextSong() {
    if (playlist.length <= 1) return false;

    if (shuffle) {
        let nextP = playlistP;

        while (playlistP == nextP) {
            nextP = Math.floor(Math.random() * playlist.length);
        }

        playlistP = nextP;
    }
    else {
        playlistP++;
    }
}

let audioCtx;
let source, gainNodeL, gainNodeR, merger, splitter;

var monoButtons = ["btn_mono_stereo", "btn_mono_left", "btn_mono_right", "btn_mono_dual"];

function updatePlayingSong() {
    if (playlist[playlistP] === undefined) return false;

    currentSong = playlist[playlistP];

    wggjAudio.currentTime = 0;

    wggjAudio.src = currentSong;
    wggjAudio.loop = repeat;

    // mono audio support!
    if (settings.mono != "stereo") {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            source = audioCtx.createMediaElementSource(wggjAudio);

            gainNodeL = audioCtx.createGain();
            gainNodeR = audioCtx.createGain();

            splitter = audioCtx.createChannelSplitter(2);
            merger = audioCtx.createChannelMerger(2);

            source.connect(splitter);

            splitter.connect(gainNodeL, 0);
            splitter.connect(gainNodeR, 1);
            gainNodeL.connect(merger, 0, 0);
            gainNodeR.connect(merger, 0, 1);

            merger.connect(audioCtx.destination);
        }
    }
    updateMonoSettings();

    asyncLoader(["songUI"]);
}

function updateMonoSettings() {
    if (!audioCtx) return;

    gainNodeL.disconnect();
    gainNodeR.disconnect();

    gainNodeL.gain.value = 1;
    gainNodeR.gain.value = 1;

    for (let obj of monoButtons) {
        objects[obj + "_t"].color = "black";
    }
    objects["btn_mono_" + settings.mono + "_t"].color = "white";

    switch (settings.mono) {
        case "stereo":
            gainNodeL.connect(merger, 0, 0);
            gainNodeR.connect(merger, 0, 1);
            break;

        case "left":
            gainNodeL.connect(merger, 0, 0);
            gainNodeR.gain.value = 0;
            break;

        case "right":
            gainNodeR.connect(merger, 0, 1);
            gainNodeL.gain.value = 0;
            break;

        case "dual":
            gainNodeL.connect(merger, 0, 0);
            gainNodeL.connect(merger, 0, 1);
            gainNodeR.connect(merger, 0, 0);
            gainNodeR.connect(merger, 0, 1);
            break;
    }

    //gainNodeL.gain.value = (settings.mono === "right") ? 0 : 1;
    //gainNodeR.gain.value = (settings.mono === "left") ? 0 : 1;
}

async function updatePlayingSongUI() {
    currentMetadata = await updateMusicMetadata();

    objects["metadataStatus"].power = false;

    console.log(currentMetadata);
    let title = await fetchSongData("title");
    let artist = await fetchSongData("artist");
    let cover = await fetchSongData("picture");

    let discordReturn = await window.lunaudiaAPI.updateDiscord(title, artist);

    if (title.length > 2) {
        document.title = title;
    }
    else document.title = "Lunaudia";

    console.log(cover);
    if (cover != "cover") objects["coverArtSet"].power = true;
    else objects["coverArtSet"].power = false;

    if (playlist.length > playlistPickerItems) createPlaylistPicker(Math.min(playlist.length - playlistPickerItems, 250));
    updatePlaylistPicker();
}

var playlistPickerItems = 0;

function createPlaylistPicker(amount) {
    for (let i = 0; i < playlistPickerItems + amount; i++) {
        if (objects["playlistPicker" + i] != undefined) continue; // hmm
        // create new song button
        createButton("playlistPicker" + i, 0.01, 0.4 + i * 0.05, 0.175, 0.05, "button", (c) => {
            if (playlistP == objects[c].songi) return; // would be unnecessary
            playlistP = objects[c].songi;
            updatePlayingSong();
        }, {
            alpha: 0.4, power: false,
            aText: { text: "", size: 16, align: "center", color: "white", maxW: 0.16 }
        });
        objects["playlistPicker" + i].songi = i;

        // add to scroll container
        objects["playlistPicker"].addChild("playlistPicker" + i);
    }
    playlistPickerItems += amount;
}

function updatePlaylistPicker() {
    for (let i = 0; i < playlistPickerItems; i++) {
        if (objects["playlistPicker" + i] == undefined) break;
        objects["playlistPicker" + i + ":text"].text = playlist[i] ? playlist[i].split("\\")[playlist[i].split("\\").length - 1] : i;
        objects["playlistPicker" + i].power = i < playlist.length;
        objects["playlistPicker" + i].alpha = (playlistP == i) ? 1 : 0.4;
    }
}

async function reloadAllSongs() {
    if (!getPlaylist(settings.currentPlaylist)) {
        settings.currentPlaylist = playlists[0];
    }

    //console.log(audioFolders);
    
    let playlistLoad = await window.lunaudiaAPI.getAudioFiles(JSON.stringify(audioFolders));
    //console.log("the load: " + playlistLoad);
    playlist = JSON.parse(playlistLoad);
    //console.log(playlist);

    playlistP = 0; // set to first song in playlist
    updatePlayingSong();
    asyncLoader(["songUI"]);

    return playlist.length;
}

function volumeSelection(c) {
    settings.volume = objects[c].config.i / 20;
    wggjAudio.volume = settings.volume;
    window.lunaudiaAPI.saveSettings(settings);

    volumeSelectionUpdate();
}

function volumeSelectionUpdate() {
    for (let j = 0; j < 21; j++) {
        objects["volumeB" + j].color = j <= (settings.volume * 20) ? ("rgb(" + (255 - j) + "," + (255 - j * 8) + "," + (255 - j * 4) + ")") : "#000000";
        objects["volumeText"].text = (settings.volume * 100).toFixed(0) + "%";
    }
}

scenes["player"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");

        //createImage("icon", 0.01, 0.02, 0.08, 0.08, "icon", { quadratic: true });
        //createText("header", 0.5, 0.1, "Lunaudia", { size: 48, color: "white" });
        createSquare("topbar", 0, 0, 1, 0.1, "rgb(120, 0, 90)", { alpha: 0.5 });
        createImage("logo", 0.5, 0, 0.3, 0.1, "lunaudia-wide-logo", { centered: true });

        createSquare("infoTextBG", 0.01, 0.11, 0.2, 0.2, "purple", { alpha: 0.3 });
        createText("infoText1", 0.02, 0.15, "", { size: 24, color: "white", align: "left" });
        createText("infoText2", 0.02, 0.2, "", { size: 24, color: "white", align: "left" });
        createText("infoText3", 0.02, 0.25, "", { size: 24, color: "white", align: "left" });
        createText("infoText4", 0.02, 0.3, "", { size: 24, color: "white", align: "left" });

        createSquare("playlistListBG", 0.01, 0.34, 0.2, 0.61, "purple", { alpha: 0.3 });
        createSquare("playlistListBG_2", 0.19, 0.425, 0.015, 0.45, "#FF9BF1", { alpha: 0.3 });
        createText("infoText5", 0.02, 0.4, "", { size: 24, color: "white", align: "left" });

        createContainer("playlistPicker", 0.01, 0.4, 0.2, 0.5,
            { YScroll: true, YLimit: [0.00001, 0], YScrollMod: 3, limitEffect: false },
            []);
        createPlaylistPicker(10);
        updatePlaylistPicker();

        createImage("metadataStatus", 0.1, 0.35, 0.05, 0.05, "metadata", { power: false, quadratic: true });

        createImage("progressBarBG", 0.2, 0.925, 0.6, 0.05, "bar");
        createSquare("progressBarHider", 0.2, 0.925, 0.6, 0.05, "pink");

        createButton("btnInfo", 0.95, 0, 0.1, 0.1, "button", () => {
            loadScene("info");
        }, {
            quadratic: true,
            aImage: { image: "help" }
        });

        // Bottom Buttons
        createButton("btnPrev", 0.3, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP > 0) {
                playlistP--;
                updatePlayingSong();
            }
        }, {
            quadratic: true, centered: true,
            aImage: { image: "previous" }
        });

        createButton("btnPause", 0.5, 0.8, 0.1, 0.1, "button", () => {
            wggjAudio.volume = settings.volume;
            if (wggjAudio.paused) {
                wggjAudio.paused = false;
                wggjAudio.play();
            }
            else {
                wggjAudio.paused = true;
                wggjAudio.pause();
                document.title = "Lunaudia";
            }
            started = true;
        }, {
            quadratic: true, centered: true,
            aImage: { image: "pause" }
        });

        createButton("btnNext", 0.7, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP < playlist.length - 1 || shuffle) {
                nextSong();
                updatePlayingSong();
            }
        }, {
            quadratic: true, centered: true,
            aImage: { image: "next" }
        });

        createButton("btnRepeat", 0.85, 0.75, 0.08, 0.08, "button", () => {
            repeat = !repeat;
            wggjAudio.loop = repeat;
        }, {
            quadratic: true, centered: true,
            aImage: { image: "repeat" }
        });

        createButton("btnShuffle", 0.85, 0.55, 0.08, 0.08, "button", () => {
            shuffle = !shuffle;
        }, {
            quadratic: true, centered: true,
            aImage: { image: "shuffle" }
        });

        createButton("btnAddSource", 0.025, 0, 0.1, 0.1, "button", () => {
            //getNewPath();
            loadScene("playlists");
        }, {
            quadratic: true, centered: true,
            aImage: { image: "folders" }
        });
        createText("promptText", 0.108, 0.4, "", { size: 24, align: "left" });



        // mono
        createButton("btn_mono_stereo", 0.7, 0.025, 0.05, 0.05, "button", () => { settings.mono = "stereo"; objects["btn_mono_stereo_t"].color = "purple"; });
        createText("btn_mono_stereo_t", 0.725, 0.06, "stereo", { color: "black" });
        createButton("btn_mono_left", 0.75, 0.025, 0.05, 0.05, "button", () => { settings.mono = "left"; objects["btn_mono_left_t"].color = "purple"; });
        createText("btn_mono_left_t", 0.775, 0.06, "left", { color: "black" });
        createButton("btn_mono_right", 0.8, 0.025, 0.05, 0.05, "button", () => { settings.mono = "right"; objects["btn_mono_right_t"].color = "purple"; });
        createText("btn_mono_right_t", 0.825, 0.06, "right", { color: "black" });
        createButton("btn_mono_dual", 0.85, 0.025, 0.05, 0.05, "button", () => { settings.mono = "dual"; objects["btn_mono_dual_t"].color = "purple"; });
        createText("btn_mono_dual_t", 0.875, 0.06, "dual", { color: "black" });
        objects["btn_mono_" + settings.mono + "_t"].color = "white";

        // right side: volume selection
        for (let i = 0; i < 21; i++) {
            createButton("volumeB" + i, 0.925, 0.95 - 0.015 * i, 0.05, 0.014, "#FFFFFF", (c) => volumeSelection(c), {
                i: i
            });
            objects["volumeB" + i].onHold = (c) => volumeSelection(c);
        }
        createText("volumeText", 0.925 + 0.05 / 2, 0.95 - 0.03 * 11, "100%", { size: 40 });

        volumeSelectionUpdate();



        // cover image
        createButton("coverArtSet", 0.3, 0.2, 0.05, 0.05, "play", () => {
            getPlaylist(settings.currentPlaylist).imageSong = currentSong;
        }, { quadratic: true, power: false });

        createButton("coverArt", 0.5, 0.25, 0.4, 0.4, "placeholderCover", () => {
            if (objects["coverArt"].h < 0.45) createAnimation("largerCover", "coverArt", (t, d, a) => { t.h = Math.min(1, 0.4 + 0.6 * a.pct); t.y = 0.25 - 0.25 * a.pct; t.w = t.h; }, 1, true);
            else if (objects["coverArt"].h > 0.95) createAnimation("smallerCover", "coverArt", (t, d, a) => { t.h = Math.max(0.4, 1 - 0.6 * a.pct); t.y = 0.25 * a.pct; t.w = t.h; }, 1, true);
        }, { quadratic: true, centered: true });



        // start, but not from another scene
        if (currentSong == "") updatePlayingSong();
        else asyncLoader(["songUI"]);
    },
    (tick) => {
        // Loop
        objects["infoText1"].text = wggjAudio.paused ? "Paused" : "";
        if (playlist.length > 0) {
            objects["infoText3"].text = convertSeconds(wggjAudio.currentTime) + " / " + convertSeconds(wggjAudio.duration);
            objects["infoText4"].text = "#" + (playlistP + 1) + " / #" + playlist.length;
        }
        if (getPlaylist(settings.currentPlaylist)) objects["infoText5"].text = "Playlist: " + getPlaylist(settings.currentPlaylist).name;

        //if (document.title === "Lunaudia" && !wggjAudio.paused) {
        //    document.title = currentSong !== "" && objects["infoText2"].text != "" ? objects["infoText2"].text.split(": ")[1] : "Lunaudia";
        //}

        objects["progressBarHider"].w = 0.6 - (0.6 * (wggjAudio.currentTime / wggjAudio.duration));
        objects["progressBarHider"].x = 0.8 - objects["progressBarHider"].w;
        //objects["progressBarHider"].w += (objects["progressBarHider"].w + objects["progressBarHider"].x) % 0.8;

        objects["btnPause:image"].image = wggjAudio.paused ? "play" : "pause";
        objects["btnRepeat:image"].image = repeat ? "repeat_on" : "repeat";
        objects["btnShuffle:image"].image = shuffle ? "shuffle_on" : "shuffle";
    }
);