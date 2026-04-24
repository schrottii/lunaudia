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
        createButton("btnBack", 0.9, 0, 0.1, 0.1, "button", () => {
            window.lunaudiaAPI.savePlaylists(playlists);
            window.lunaudiaAPI.saveSettings(settings);
            loadScene("player");
        }, { quadratic: true, centered: true });
        createText("btnBackText", 0.9, 0.075, "Back", { size: 40, color: "white" });
    },
    (tick) => {
        updateListWindow(playlists);
        objects["promptText"].text = customPrompt.active ? ("New name: " + customPrompt.text + (timer > 0.5 ? "|" : "")) : "";
    }
);