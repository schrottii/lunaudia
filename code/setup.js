// this file is the equivalent to the usual main.js, as that name is taken by node here

// WGGJ
images = {
    // core
    bg: "assets/textures/core/bg.png",
    button: "assets/textures/core/button.png",
    bar: "assets/textures/core/colorful_bar.png",

    // icon
    icon: "assets/textures/icon/icon.png",

    // gui
    "play": "assets/textures/gui/play.png",
    "pause": "assets/textures/gui/pause.png",
    "previous": "assets/textures/gui/previous.png",
    "next": "assets/textures/gui/next.png",
    "shuffle": "assets/textures/gui/shuffle.png",
    "shuffle_on": "assets/textures/gui/shuffle_on.png",
    "repeat": "assets/textures/gui/repeat.png",
    "repeat_on": "assets/textures/gui/repeat_on.png",
    "help": "assets/textures/gui/help.png",
    "metadata": "assets/textures/gui/metadata.png",
    "newfolder": "assets/textures/gui/newfolder.png",
    "editfolder": "assets/textures/gui/editfolder.png",
    "edit": "assets/textures/gui/edit.png",
    "delete": "assets/textures/gui/delete.png",
    "folders": "assets/textures/gui/folders.png",

    // cover
    placeholderCover: "assets/textures/coverart/placeholder_cover.png",
    cover: "assets/textures/coverart/placeholder_cover.png",
    coverMD: "assets/textures/coverart/placeholder_cover.png",
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
        // remove string stuff
        for (let char in customPrompt.text) {
            if (customPrompt.text[char] == '"' || customPrompt.text[char] == "'" || customPrompt.text[char] == "`") customPrompt.text.splice(char, 1);
        }

        // finalize
        customPrompt.active = false;
        customPrompt.resolve(customPrompt.text);
    }
});

async function getNewPath() {
    let newPath = await createCustomPrompt("Enter new path: ");
    //audioFolders.push(newPath);

    reloadAllSongs();
    window.lunaudiaAPI.savePaths();
    return newPath;
}



// list window overlay
function createListWindow(title, height, elements) {
    // header
    createSquare("headerSquare", 0, 0, 1, 0.1, "rgb(200, 0, 100, 0.3)");
    createImage("icon", 0.01, 0.02, 0.08, 0.08, "icon", { quadratic: true });
    createText("header", 0.5, 0.1, title, { size: 48, color: "white" });

    // the list
    createContainer("listContainer", 0, 0.1, 1, 0.9, { XScroll: false, YScroll: true, limitEffect: true, YLimit: [0.0001, 0] }, []);
    objects["listContainer"].heightL = height;

    for (let e in elements) {
        createListWindowElement(elements[e], e, height);
    }

    /* 
    expected structure of an element:
    image: abc.png
    createContent = (y) => {
        createThing(...);
        return ["thing"];
    }
    */
}

function createListWindowElement(element, e, height) {
    let y = 0.1 + height * e;
    let coverImage = element.getImage();

    createSquare("list_" + e + "_bg", 0, y, 1, height - 0.01, "rgb(200, 0, 100)");
    if (coverImage) createImage("list_" + e + "_img", 0.05, y + 0.02, 0.16, 0.16, coverImage, { quadratic: true });

    objects["listContainer"].children.push("list_" + e + "_bg");
    if (coverImage) objects["listContainer"].children.push("list_" + e + "_img");
    objects["listContainer"].children.push(...element.createContent(e, y));
}

function updateListWindow(elements) {
    let element;
    for (let e in elements) {
        element = elements[e];
        element.updateContent(e);
    }
    if (elements.length < 1 / objects["listContainer"].heightL) objects["listContainer"].YScroll = false;
    else objects["listContainer"].YScroll = true;
    objects["listContainer"].YLimit[1] = ((elements.length + 1) * objects["listContainer"].heightL) - 0.99;
}



window.lunaudiaAPI.onExecuteAction((data) => {
    //console.log("call from backend: ", data.fun, data.data);

    switch (data.fun) {
        case "getSubdirsAllowed":
            return getSubdirsAllowed(data.data);
            break;
        case "setCover":
            console.log(data, data.data);
            return setCover(data.data);
            break;
        case "setCoverPlaceHolder":
            console.log("placeholder");
            images.cover = images.placeholderCover;
            break;
    }
});

function setCover(src0) {
    src0 = JSON.parse(src0);

    let img = new Image();
    img.src = src0;
    img.onload = () => {
        images["cover"] = img;
    }
}



var asyncLoaders = [];

function asyncLoader(content) {
    content.unshift(false);
    asyncLoaders.push(content);
}

async function asyncLooper() {
    for (let as of asyncLoaders) {
        if (as[0] == true) continue;
        as[0] = true;
        if (as[1] == "cover") {
            await as[2].getAsyncImage();
            asyncLoaders.splice(asyncLoaders.indexOf(as), 1);
        }
        if (as[1] == "songUI" && objects["metadataStatus"] != undefined) {
            await updatePlayingSongUI();
            asyncLoaders.splice(asyncLoaders.indexOf(as), 1);
        }
    }
}

setInterval(async () => await asyncLooper(), 67);