scenes["playlists"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");

        createListWindow("Playlists", 0.2, playlists);
        createText("promptText", 0.25, 0.05, "", { size: 24, align: "left" });

        // New button
        createButton("btnNew", 0.75, 0, 0.1, 0.1, "button", () => {
            playlists.push(new Playlist("path", "Playlist " + (playlists.length + 1), []));
            createListWindowElement(playlists[playlists.length - 1], playlists.length - 1, 0.2);
        }, { quadratic: true, centered: true });
        createText("btnNewText", 0.75, 0.075, "+", { size: 40, color: "white" });

        // Back button
        createButton("btnBack", 0.8, 0, 0.2, 0.1, "button", () => {
            window.lunaudiaAPI.savePlaylists(playlists);
            window.lunaudiaAPI.saveSettings(settings);
            loadScene("player");
        }, {
            aText: { size: 32, color: "white", text: "< Back" }
        });
    },
    (tick) => {
        updateListWindow(playlists);
    }
);