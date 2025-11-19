// WGGJ
images = {
    bg: "bg.png",
    icon: "icon.png",
    button: "button.png",
    placeholderCover: "placeholder_cover.png",
    bar: "colorful_bar.png",

    "play": "play.png",
    "pause": "pause.png",
    "previous": "previous.png",
    "next": "next.png",
    "shuffle": "shuffle.png",
    "shuffle_on": "shuffle_on.png",
    "repeat": "repeat.png",
    "repeat_on": "repeat_on.png",
    "help": "help.png",
    "metadata": "metadata.png",
    "newfolder": "newfolder.png",

    cover: "placeholder_cover.png",
    coverMD: "placeholder_cover.png",
}

wggj.config.startScene = "player";
wggj.config.gameName = "Lunaudia";
wggj.config.font = "OpenSans";

wggjLoadImages();
wggjLoop();



// custom prompt as electron does not allow
// implement into WGGJ in the future?
var customPrompt = {
    active: false,
    prevKey: "",
    text: "",
    message: "",
    resolve: null
}

function createCustomPrompt(message) {
    return new Promise(resolve => {
        customPrompt.active = true;
        customPrompt.text = "";
        customPrompt.message = message;
        customPrompt.resolve = resolve;
    });
}

document.addEventListener("keydown", (e) => {
    if (customPrompt.active == false) return;
    //console.log(e.key, customPrompt.prevKey);

    // paste
    if ((e.key == "Control" && customPrompt.prevKey == "v") || (customPrompt.prevKey == "Control" && e.key == "v")) {
        navigator.clipboard
            .readText()
            .then((result) => (customPrompt.text = customPrompt.text + result));
        customPrompt.prevKey = "";
        return true; // to not also add a single char
    }

    customPrompt.prevKey = e.key;

    // add singular keys to the prompt
    if (e.key.length === 1) {
        customPrompt.text = customPrompt.text + e.key;
    }

    // remove one if del
    if (e.key === "Backspace") {
        customPrompt.text = customPrompt.text.slice(0, -1);
    }

    // send it!
    if (e.key === "Enter") {
        customPrompt.active = false;
        customPrompt.resolve(customPrompt.text);
    }
});

async function getNewPath() {
    let newPath = await createCustomPrompt("Enter new path: ");
    audioFolders.push(newPath);

    reloadAllSongs();
    savePaths();
}