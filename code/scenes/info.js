scenes["info"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");
        createImage("icon", 0.01, 0.02, 0.08, 0.08, "icon", { quadratic: true });
        createText("header", 0.5, 0.1, "Lunaudia info", { size: 48, color: "white" });

        createText("infoText1", 0.5, 0.15, "Lunaudia is a simple local audio file player", { size: 24, color: "white", align: "center" });
        //createText("infoText2", 0.5, 0.2, "(Put your audio files in the 'audio' folder next to the .exe)", { size: 24, color: "white", align: "center" });

        createText("infoText3", 0.5, 0.3, "Made by Schrottii / Balnoom (c) 2025 - 2026", { size: 24, color: "white", align: "center" });
        createText("infoText4", 0.5, 0.35, "v1.4 (2026-04-25)", { size: 24, color: "white", align: "center" });

        createButton("btn1", 0.3, 0.5, 0.4, 0.1, "button", () => {
            window.open("https://github.com/schrottii/lunaudia", "_blank");
        }, { quadratic: true, centered: true });
        createText("btn1t", 0.3, 0.575, "See on GitHub", { size: 40, color: "white" });

        createButton("btn2", 0.7, 0.5, 0.4, 0.1, "button", () => {
            window.open("https://discord.gg/CbBeJXKUrk", "_blank");
        }, { quadratic: true, centered: true });
        createText("btn2t", 0.7, 0.575, "Discord", { size: 40, color: "white" });

        createButton("btn3", 0.5, 0.65, 0.4, 0.1, "button", () => {
            window.open("https://ko-fi.com/schrottii", "_blank");
        }, { quadratic: true, centered: true });
        createText("btn3t", 0.5, 0.725, "Donate", { size: 40, color: "white" });

        // Back button
        createButton("btnBack", 0.5, 0.8, 0.4, 0.1, "button", () => {
            loadScene("player");
        }, { quadratic: true, centered: true });
        createText("btnBackText", 0.5, 0.875, "Back", { size: 40, color: "white" });
    },
    (tick) => {
    }
);