scenes["info"] = new Scene(
    () => {
        // Init
        createImage("bg", 0, 0, 1, 1, "bg");
        createImage("icon", 0.01, 0.02, 0.08, 0.08, "icon", { quadratic: true });
        createText("header", 0.5, 0.1, "Lunaudia info", { size: 48, color: "white" });

        createText("infoText1", 0.5, 0.15, "Lunaudia is a simple local audio file player", { size: 24, color: "white", align: "center" });
        //createText("infoText2", 0.5, 0.2, "(Put your audio files in the 'audio' folder next to the .exe)", { size: 24, color: "white", align: "center" });

        createText("infoText3", 0.5, 0.25, "Made by Schrottii / Balnoom (c) 2025 - 2026", { size: 24, color: "white", align: "center" });
        createText("infoText4", 0.5, 0.3, Lunaudia.version + " (" + Lunaudia.versiondate + ")", { size: 24, color: "white", align: "center" });

        createButton("btn1", 0.3, 0.4, 0.4, 0.1, "button", () => {
            window.open("https://github.com/schrottii/lunaudia", "_blank");
        }, {
            quadratic: true, centered: true,
            aText: { size: 40, color: "white", text: "See on GitHub" }
        });

        createButton("btn2", 0.7, 0.4, 0.4, 0.1, "button", () => {
            window.open("https://discord.gg/CbBeJXKUrk", "_blank");
        }, {
            quadratic: true, centered: true,
            aText: { size: 40, color: "white", text: "Discord" }
        });

        createButton("btn3", 0.3, 0.55, 0.4, 0.1, "button", () => {
            window.open("https://ko-fi.com/schrottii", "_blank");
        }, {
            quadratic: true, centered: true,
            aText: { size: 40, color: "white", text: "Donate" }
        });

        createButton("btn4", 0.7, 0.55, 0.4, 0.1, "button", () => {
            window.open("PATCHNOTES.md", "_blank");
        }, {
            quadratic: true, centered: true,
            aText: { size: 40, color: "white", text: "Patch notes" }
        });



        createButton("btn_legal1", 0, 0.7, 0.2, 0.3 / 4, "button", () => {
            window.open("README.md", "_blank");
        }, {
            aText: { size: 40, color: "white", text: "Info" }
        });

        createButton("btn_legal2", 0, 0.7 + (0.3 / 4) * 1, 0.2, 0.3 / 4, "button", () => {
            window.open("LICENSE.md", "_blank");
        }, {
            aText: { size: 30, color: "white", text: "License" }
        });

        createButton("btn_legal3", 0, 0.7 + (0.3 / 4) * 2, 0.2, 0.3 / 4, "button", () => {
            window.open("TOS.md", "_blank");
        }, {
            aText: { size: 30, color: "white", text: "Terms of Service" }
        });

        createButton("btn_legal4", 0, 0.7 + (0.3 / 4) * 3, 0.2, 0.3 / 4, "button", () => {
            window.open("PRIVACY.md", "_blank");
        }, {
            aText: { size: 30, color: "white", text: "Privacy policy" }
        });

        // Back button
        /*
        createButton("btnBack", 0.5, 0.8, 0.4, 0.1, "button", () => {
            loadScene("player");
        }, {
            quadratic: true, centered: true,
            aText: { size: 30, color: "white", text: "Back" }
        });
        */

        // Back button
        createButton("btnBack", 0.8, 0, 0.2, 0.1, "button", () => {
            loadScene("player");
        }, {
            aText: { size: 32, color: "white", text: "< Back" }
        });
    },
    (tick) => {
    }
);