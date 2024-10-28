let canvas;
let world;
let keyboard = new Keyboard();
let intro = 'img/9_intro_outro_screens/start/startscreen_1.png';  // Pfad als String

function init() {
    canvas = document.getElementById('canvas');
    showIntro();  // Zeige das Intro beim Start der Seite
}

function showIntro() {
    let ctx = canvas.getContext('2d');
    let introImage = new Image();
    introImage.src = intro;

    introImage.onload = () => {
        // Zeige das Intro-Bild auf dem Canvas an
        ctx.drawImage(introImage, 0, 0, canvas.width, canvas.height);
    };

    // Zeige den Start-Button an
    document.getElementById('startButton').style.display = 'block';
}

function startGame() {
    // Verstecke den Start-Button und starte das Spiel
    document.getElementById('startButton').style.display = 'none';
    world = new World(canvas, keyboard);  // Initialisiere das Spiel
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }
});
