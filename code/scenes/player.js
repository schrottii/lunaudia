var playlist = [];
var playlistP = 0;
var currentSong = "";
var started = false;
var timer = 0;

var repeat = false;
var shuffle = false;

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

function updatePlayingSong() {
    if (playlist[playlistP] === undefined) return false;

    wggjAudio.currentTime = 0;
    currentSong = playlist[playlistP];

    wggjAudio.src = currentSong;
    wggjAudio.loop = repeat;

    asyncLoader(["songUI"]);
}

async function updatePlayingSongUI() {
    objects["metadataStatus"].power = false;

    let title = await fetchSongData("title");
    let artist = await fetchSongData("artist");
    console.log(title, artist);
    let discordReturn = await window.lunaudiaAPI.updateDiscord(title, artist);
    console.log(discordReturn);

    document.title = title;

    await updateMusicMetadata();
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
}

function volumeSelection(c) {
    settings.volume = objects[c].config.i / 20;
    wggjAudio.volume = settings.volume;
    window.lunaudiaAPI.saveSettings(settings);

    volumeSelectionUpdate();
}

function volumeSelectionUpdate() {
    for (let j = 0; j < 21; j++) {
        objects["volumeB" + j].color = j <= (settings.volume * 20) ? "#FFFFFF" : "#000000";
        objects["volumeText"].text = (settings.volume * 100).toFixed(0) + "%";
    }
}

scenes["player"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");
        createImage("icon", 0.01, 0.02, 0.08, 0.08, "icon", { quadratic: true });
        createText("header", 0.5, 0.1, "Lunaudia", { size: 48, color: "white" });

        createText("infoText1", 0.1, 0.15, "", { size: 24, color: "white", align: "left" });
        createText("infoText2", 0.1, 0.2, "", { size: 24, color: "white", align: "left" });
        createText("infoText3", 0.1, 0.25, "", { size: 24, color: "white", align: "left" });
        createText("infoText4", 0.1, 0.3, "", { size: 24, color: "white", align: "left" });

        createImage("metadataStatus", 0.1, 0.35, 0.05, 0.05, "metadata", { power: false, quadratic: true });

        createImage("progressBarBG", 0.2, 0.925, 0.6, 0.05, "bar");
        createSquare("progressBarHider", 0.2, 0.925, 0.6, 0.05, "pink");

        createButton("btnInfo", 0.95, 0.05, 0.1, 0.1, "button", () => {
            loadScene("info");
        }, { quadratic: true, centered: true });
        createImage("btnInfoImg", 0.95, 0.05, 0.1, 0.1, "help", { quadratic: true, centered: true });

        // Bottom Buttons
        createButton("btnPrev", 0.3, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP > 0) {
                playlistP--;
                updatePlayingSong();
            }
        }, { quadratic: true, centered: true });
        createImage("btnPrevImg", 0.3, 0.8, 0.1, 0.1, "previous", { quadratic: true, centered: true });

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
        }, { quadratic: true, centered: true });
        createImage("btnPauseImg", 0.5, 0.8, 0.1, 0.1, "pause", { quadratic: true, centered: true });

        createButton("btnNext", 0.7, 0.8, 0.1, 0.1, "button", () => {
            if (playlistP < playlist.length - 1 || shuffle) {
                nextSong();
                updatePlayingSong();
            }
        }, { quadratic: true, centered: true });
        createImage("btnNextImg", 0.7, 0.8, 0.1, 0.1, "next", { quadratic: true, centered: true });

        createButton("btnRepeat", 0.1, 0.75, 0.08, 0.08, "button", () => {
            repeat = !repeat;
            wggjAudio.loop = repeat;
        }, { quadratic: true, centered: true });
        createImage("btnRepeatImg", 0.1, 0.75, 0.08, 0.08, "repeat", { quadratic: true, centered: true });

        createButton("btnShuffle", 0.1, 0.55, 0.08, 0.08, "button", () => {
            shuffle = !shuffle;
        }, { quadratic: true, centered: true });
        createImage("btnShuffleImg", 0.1, 0.55, 0.08, 0.08, "shuffle", { quadratic: true, centered: true });

        createButton("btnAddSource", 0.1, 0.35, 0.08, 0.08, "button", () => {
            //getNewPath();
            loadScene("playlists");
        }, { quadratic: true, centered: true });
        createImage("btnAddSourceImg", 0.1, 0.35, 0.08, 0.08, "folders", { quadratic: true, centered: true });
        createText("promptText", 0.108, 0.4, "", { size: 24, align: "left" });

        // right side: volume selection
        for (let i = 0; i < 21; i++) {
            createButton("volumeB" + i, 0.925, 0.95 - 0.015 * i, 0.05, 0.014, "#FFFFFF", (c) => volumeSelection(c), {
                i: i
            });
            objects["volumeB" + i].onHold = (c) => volumeSelection(c);
        }
        
        createText("volumeText", 0.925 + 0.05 / 2, 0.95 - 0.03 * 11, "100%", { size: 40 });

        createButton("coverArt", 0.5, 0.25, 0.4, 0.4, "placeholderCover", () => {
            if (objects["coverArt"].h < 0.5) createAnimation("largerCover", "coverArt", (t, d, a) => { t.h = 0.4 + 0.6 * a.pct; t.y = 0.25 - 0.25 * a.pct; t.w = t.h; }, 1, true);
            else createAnimation("smallerCover", "coverArt", (t, d, a) => { t.h = 1 - 0.6 * a.pct; t.y = 0.25 * a.pct; t.w = t.h; }, 1, true);
        }, { quadratic: true, centered: true });

        createButton("coverArtSet", 0.7, 0.25, 0.05, 0.05, "play", () => {
            getPlaylist(settings.currentPlaylist).imageSong = currentSong;
        }, { quadratic: true });

        volumeSelectionUpdate();

        // start, but not from another scene
        if (currentSong == "") updatePlayingSong();
        else asyncLoader(["songUI"]);
    },
    (tick) => {
        // Loop
        objects["infoText1"].text = wggjAudio.paused ? "Paused" : "";
        if (playlist.length > 0) {
            objects["infoText3"].text = wggjAudio.currentTime.toFixed(0) + "s / " + wggjAudio.duration.toFixed(0) + "s";
            objects["infoText4"].text = "#" + (playlistP + 1) + " / #" + playlist.length;
        }

        if (document.title === "Lunaudia" && !wggjAudio.paused) {
            document.title = currentSong !== "" && objects["infoText2"].text != "" ? objects["infoText2"].text.split(": ")[1] : "Lunaudia";
        }

        objects["progressBarHider"].w = 0.6 - (0.6 * (wggjAudio.currentTime / wggjAudio.duration));
        objects["progressBarHider"].x = 0.8 - objects["progressBarHider"].w;
        //objects["progressBarHider"].w += (objects["progressBarHider"].w + objects["progressBarHider"].x) % 0.8;

        objects["btnPauseImg"].image = wggjAudio.paused ? "play" : "pause";
        objects["btnRepeatImg"].image = repeat ? "repeat_on" : "repeat";
        objects["btnShuffleImg"].image = shuffle ? "shuffle_on" : "shuffle";

        timer = (timer + tick) % 1;
        objects["promptText"].text = customPrompt.active ? (customPrompt.text + (timer > 0.5 ? "|" : "")) : "";
    }
);