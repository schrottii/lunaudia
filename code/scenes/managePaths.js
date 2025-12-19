class PLPath {
    constructor(path, origin) {
        this.path = path;
        this.origin = origin;
    }

    createContent(i, y) {
        createText(i + "_name", 0.2, y + 0.04, "Path", { align: "left", size: 30, color: "white" });
        createText(i + "_sel", 0.2, y + 0.18, "", { align: "left", size: 30, color: "white" });

        // buttons: change path, remove path, subdirs on/off
        createButton(i + "_change", 0.4, y + 0.08, 0.1, 0.1, "button", async () => {
            let newName = await createCustomPrompt("New name: ");

            this.path = newName;
            this.origin.paths[this.origin.paths.indexOf(this.path)] = newName;
            if (this.origin.name == settings.currentPlaylist) this.origin.loadSongs();
        }, { quadratic: true, centered: true });
        createImage(i + "_changeImg", 0.4, y + 0.08, 0.1, 0.1, "editfolder", { quadratic: true, centered: true });
        createText(i + "_changeTxt", 0.4, y + 0.08, "Change", { size: 24, color: "white" });

        createButton(i + "_remove", 0.5, y + 0.08, 0.1, 0.1, "button", async () => {
            //console.log(this.path, this.origin.paths);
            this.origin.paths.splice(this.origin.paths.indexOf(this.path), 1);
            loadScene("managePaths");
        }, { quadratic: true, centered: true });
        createImage(i + "_removeImg", 0.5, y + 0.08, 0.1, 0.1, "delete", { quadratic: true, centered: true });
        createText(i + "_removeTxt", 0.5, y + 0.08, "Remove", { size: 24, color: "white" });

        createButton(i + "_subdirs", 0.6, y + 0.08, 0.1, 0.1, "button", async () => {
            this.checkPathSettings();
            if (this.origin.pathSettings[this.path].subdirs == true) this.origin.pathSettings[this.path].subdirs = false;
            else this.origin.pathSettings[this.path].subdirs = true; // default if undefined
        }, { quadratic: true, centered: true });
        createImage(i + "_subdirsImg", 0.6, y + 0.08, 0.1, 0.1, "folders", { quadratic: true, centered: true });
        createText(i + "_subdirsTxt", 0.6, y + 0.08, "Subdirs?", { size: 24, color: "white" });

        return [
            i + "_name", i + "_sel",
            i + "_change", i + "_changeImg", i + "_changeTxt",
            i + "_remove", i + "_removeImg", i + "_removeTxt",
            i + "_subdirs", i + "_subdirsImg", i + "_subdirsTxt"
        ];
    }

    checkPathSettings() {
        if (this.origin.pathSettings == undefined) this.origin.pathSettings = {};
        if (this.origin.pathSettings[this.path] == undefined) this.origin.pathSettings[this.path] = {};
    }

    getSetting(settingName) {
        this.checkPathSettings();
        return this.origin.pathSettings[this.path][settingName];
    }

    updateContent(i) {
        if (objects[i + "_subdirsTxt"] == undefined) return false;
        objects[i + "_name"].text = this.path;

        objects[i + "_subdirsTxt"].text = "Subdirs: " + (this.getSetting("subdirs") ? "ON" : "OFF");

        objects["list_" + i + "_img"].alpha = 0;
    }

    getImage() {
        return "help";
    }
}

var plpaths = [];

scenes["managePaths"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");

        plpaths = [];
        for (let path of selectedPlaylistForPaths.paths) {
            plpaths.push(new PLPath(path, selectedPlaylistForPaths));
        }

        createListWindow("Playlists", 0.2, plpaths);
        createText("promptText", 0.25, 0.05, "", { size: 24, align: "left" });
        objects["header"].text = selectedPlaylistForPaths.name;

        // New button
        createButton("btnNew", 0.75, 0, 0.1, 0.1, "button", async () => {
            let newSong = await getNewPath();
            if (!selectedPlaylistForPaths.paths.includes(newSong)) {
                selectedPlaylistForPaths.paths.push(newSong);
                //console.log(newSong, selectedPlaylistForPaths);
                plpaths.push(new PLPath(newSong, selectedPlaylistForPaths));
                createListWindowElement(plpaths[plpaths.length - 1], plpaths.length - 1, 0.2);
            }
        }, { quadratic: true, centered: true });
        createText("btnNewText", 0.75, 0.075, "+", { size: 40, color: "white" });

        // Back button
        createButton("btnBack", 0.9, 0, 0.1, 0.1, "button", () => {
            loadScene("playlists");
        }, { quadratic: true, centered: true });
        createText("btnBackText", 0.9, 0.075, "Back", { size: 40, color: "white" });
    },
    (tick) => {
        updateListWindow(plpaths);
        objects["promptText"].text = customPrompt.active ? ("New path: " + customPrompt.text + (timer > 0.5 ? "|" : "")) : "";
    }
);