class Playlist {
    constructor(type, name, songs, other) {
        this.type = type;
        this.name = name ? name : "";
        this.songs = songs ? songs : [];
        if (other) {
            for (let o in other) {
                if (o == "type" || o == "name" || o == "songs" || o == "other" || o == "preloadedCover") continue;
                this[o] = other[o];
            }
        }

        this.imageSong = undefined;
    }

    createContent(i, y) {
        createText(i + "_name", 0.2, y + 0.04, "Playlist name", { align: "left", size: 30, color: "white" });
        createText(i + "_sel", 0.2, y + 0.18, "", { align: "left", size: 30, color: "white" });

        // buttons: select, change name, add path, edit paths
        createButton(i + "_select", 0.4, y + 0.08, 0.1, 0.1, "button", () => {
            settings.currentPlaylist = this.name;
            this.loadSongs();
        }, { quadratic: true, centered: true });
        createImage(i + "_selectImg", 0.4, y + 0.08, 0.1, 0.1, "play", { quadratic: true, centered: true });
        createText(i + "_selectTxt", 0.4, y + 0.08, "Select", { size: 24, color: "white" });

        createButton(i + "_changeName", 0.5, y + 0.08, 0.1, 0.1, "button", async () => {
            let oldName = this.name;
            let newName = await createCustomPrompt("New name: ");

            this.name = newName;
            if (settings.currentPlaylist == oldName) settings.currentPlaylist = newName;
        }, { quadratic: true, centered: true });
        createImage(i + "_changeNameImg", 0.5, y + 0.08, 0.1, 0.1, "edit", { quadratic: true, centered: true });
        createText(i + "_changeNameTxt", 0.5, y + 0.08, "Change name", { size: 24, color: "white" });

        createButton(i + "_addPath", 0.6, y + 0.08, 0.1, 0.1, "button", async () => {
            let newSong = await getNewPath();
            if (!this.paths.includes(newSong)) this.paths.push(newSong);
        }, { quadratic: true, centered: true });
        createImage(i + "_addPathImg", 0.6, y + 0.08, 0.1, 0.1, "newfolder", { quadratic: true, centered: true });
        createText(i + "_addPathTxt", 0.6, y + 0.08, "Add path", { size: 24, color: "white" });

        createButton(i + "_paths", 0.7, y + 0.08, 0.1, 0.1, "button", async () => {
            selectedPlaylistForPaths = this;
            loadScene("managePaths");
        }, { quadratic: true, centered: true });
        createImage(i + "_pathsImg", 0.7, y + 0.08, 0.1, 0.1, "editfolder", { quadratic: true, centered: true });
        createText(i + "_pathsTxt", 0.7, y + 0.08, "", { size: 24, color: "white" });

        return [
            i + "_name", i + "_sel",
            i + "_select", i + "_selectImg", i + "_selectTxt",
            i + "_changeName", i + "_changeNameImg", i + "_changeNameTxt",
            i + "_addPath", i + "_addPathImg", i + "_addPathTxt",
            i + "_paths", i + "_pathsImg", i + "_pathsTxt"
        ];
    }

    updateContent(i) {
        if (this.paths == undefined) this.paths = [];
        if (objects[i + "_name"] == undefined) return false;
        objects[i + "_name"].text = this.name + " (" + this.getAmountOfSongs() + " songs)";
        objects[i + "_sel"].text = settings.currentPlaylist == this.name ? "Selected" : "";
        objects[i + "_select"].power = objects[i + "_selectTxt"].power = objects[i + "_selectImg"].power = !(settings.currentPlaylist == this.name);
        objects[i + "_pathsTxt"].text = this.paths.length + " paths";

        objects["list_" + i + "_img"].image = this.getImage();
    }

    getImage() {
        if (this.preloadedCover) {
            return this.preloadedCover;
        }
        else {
            asyncLoader(["cover", this]); // loads getAsyncImage below
            return "placeholderCover";
        }
    }

    async getAsyncImage() {
        let cov = await getPlaylistCover(this);
        if (cov != undefined && cov != "cover") this.preloadedCover = cov;
    }

    async loadSongs() {
        if (this.type == "path") {
            // songs are paths here instead
            audioFolders = this.paths;
            this.amountOfSongs = await reloadAllSongs();
            updatePlayingSong();
        }
    }

    getAmountOfSongs() {
        if (this.amountOfSongs) return this.amountOfSongs;
        return 0;
    }
}

function getPlaylist(name) {
    for (let p in playlists) {
        if (playlists[p].name == name) return playlists[p];
    }
}

var playlists = [
    new Playlist('path', 'Local', [], {
        paths: []
    })
];

async function prepareLocalPlaylist(folders) {
    /*
    playlists[0].paths[0] = await window.lunaudiaAPI.getFolderPathAudio();
    playlists[0].paths[1] = await window.lunaudiaAPI.pathome("Music");
    console.log(playlists[0].paths);
    */

    playlists[0].paths = folders;
}

var selectedPlaylistForPaths = "";