class Playlist {
    constructor(type, name, songs, other) {
        this.type = type;
        this.name = name ? name : "";
        this.songs = songs ? songs : [];

        this.imageSong = undefined;
        this.imagePath = undefined;

        if (other) {
            for (let o in other) {
                if (o == "type" || o == "name" || o == "songs" || o == "other" || o == "preloadedCover") continue;
                this[o] = other[o];
            }
        }
    }

    createContent(i, y) {
        createText(i + "_name", 0.2, y + 0.04, "Playlist name", { align: "left", size: 30, color: "white" });
        createText(i + "_sel", 0.2, y + 0.18, "", { align: "left", size: 30, color: "white" });

        // buttons: select, change name, add path, edit paths
        createButton(i + "_select", 0.4, y + 0.08, 0.1, 0.1, "button", () => {
            settings.currentPlaylist = this.name;
            this.loadSongs();
        }, {
            quadratic: true, centered: true,
            aImage: { image: "play" },
            aText: { size: 24, color: "#FF9BF1", text: "Select", offset: [0, -0.075 * wggj.canvas.h] }
        });

        createButton(i + "_changeName", 0.5, y + 0.08, 0.1, 0.1, "button", async () => {
            let oldName = this.name;
            let newName = await createCustomPrompt("New name: ");

            this.name = newName;
            if (settings.currentPlaylist == oldName) settings.currentPlaylist = newName;
        }, {
            quadratic: true, centered: true,
            aImage: { image: "edit" },
            aText: { size: 24, color: "#FF9BF1", text: "Change name", offset: [0, -0.075 * wggj.canvas.h] }
        });

        createButton(i + "_addPath", 0.6, y + 0.08, 0.1, 0.1, "button", async () => {
            let newSong = await getNewPath();
            if (!this.paths.includes(newSong)) this.paths.push(newSong);
        }, {
            quadratic: true, centered: true,
            aImage: { image: "newfolder" },
            aText: { size: 24, color: "#FF9BF1", text: "Add path", offset: [0, -0.075 * wggj.canvas.h] }
        });

        createButton(i + "_paths", 0.7, y + 0.08, 0.1, 0.1, "button", async () => {
            selectedPlaylistForPaths = this;
            loadScene("managePaths");
        }, {
            quadratic: true, centered: true,
            aImage: { image: "editfolder" },
            aText: { size: 24, color: "#FF9BF1", text: "", offset: [0, -0.075 * wggj.canvas.h] }
        });

        createButton(i + "_remove", 0.8, y + 0.08, 0.1, 0.1, "button", async () => {
            let index = -1;
            for (let p in playlists) {
                if (playlists[p].name == this.name) index = p;
            }
            if (index === -1) return false;
            playlists.splice(index, 1);
            loadScene("playlists");
        }, {
            quadratic: true, centered: true,
            aImage: { image: "delete" },
            aText: { size: 24, color: "#FF9BF1", text: "Remove", offset: [0, -0.075 * wggj.canvas.h] }
        });

        createButton(i + "_imagePath", 0.9, y + 0.08, 0.1, 0.1, "button", async () => {
            this.imagePath = await createCustomPrompt("New image path: ");
        }, {
            quadratic: true, centered: true,
            aImage: { image: "edit" },
            aText: { size: 20, color: "#FF9BF1", text: "Image from path", offset: [0, -0.075 * wggj.canvas.h] }
        });

        return [
            i + "_name", i + "_sel",
            i + "_select",
            i + "_changeName",
            i + "_addPath",
            i + "_paths",
            i + "_remove",
            i + "_imagePath",
        ];
    }

    updateContent(i) {
        if (this.paths == undefined) this.paths = [];
        if (objects[i + "_name"] == undefined) return false;
        objects[i + "_name"].text = this.name + " (" + this.getAmountOfSongs() + " songs)";
        objects[i + "_sel"].text = settings.currentPlaylist == this.name ? "Selected" : "";
        objects[i + "_select"].power = objects[i + "_select:text"].power = objects[i + "_select:image"].power = !(settings.currentPlaylist == this.name);
        objects[i + "_paths:text"].text = this.paths.length + " paths";

        objects["list_" + i + "_img"].image = this.getImage();
    }

    getImage() {
        if (this.imagePath) {
            if (images[this.imagePath] == undefined) {
                try {
                    images[this.imagePath] = base64ToImage(this.imagePath);
                }
                catch {
                    this.imagePath = "placeholderCover";
                }
            }
            return this.imagePath;
        }
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