let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;  // Status für Stummschaltung
let startScreen = 'img/9_intro_outro_screens/start/startscreen_1.png';

function init() {
    canvas = document.getElementById('canvas');
    showIntro();  // Zeige das Intro beim Start der Seite
    setupSoundButton();  // Setze den Sound-Button auf
}

function showIntro() {
    let ctx = canvas.getContext('2d');
    let introImage = new Image();
    introImage.src = startScreen;

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

    // Beende die bestehende World-Instanz, falls eine existiert
    if (world) {
        world.stopGameLoops();  // Stoppt alle Animationen und Intervalle
        world = null;  // Setze die World-Instanz auf null
    }
    
    world = new World(canvas, keyboard);  // Initialisiere die neue World-Instanz
    
    // Starte die Hintergrundmusik nach Benutzerinteraktion
    playBackgroundMusic();
}


function playBackgroundMusic() {
    const audioElement = document.getElementById('backgroundAudio');
    audioElement.play().catch(error => {
        console.error('Autoplay wurde blockiert. Benutzerinteraktion erforderlich:', error);
    });
}

function setupSoundButton() {
    const soundButton = document.getElementById('soundButton');
    
    // Eventlistener für den Sound-Button
    soundButton.addEventListener('click', toggleSound);
}

function toggleSound() {
    const audioElement = document.getElementById('backgroundAudio');
    const soundIcon = document.getElementById('soundIcon');

    if (!audioElement) {
        console.error('Audio-Element mit ID "backgroundAudio" wurde nicht gefunden.');
        return;
    }

    isMuted = !isMuted;  // Umschalten des Mute-Status

    // Hintergrundmusik umschalten
    audioElement.muted = isMuted;

    // Mute alle Charakter-Sounds, falls die world und der character bereits existieren
    if (world && world.character) {
        muteCharacterSounds(isMuted);
    }

    // Icon ändern
    soundIcon.src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
}

function muteCharacterSounds(mute) {
    // Überprüfen, ob der Charakter bereits initialisiert ist
    const character = world.character;
    if (!character) {
        console.error('Character wurde nicht gefunden.');
        return;
    }

    // Mute alle relevanten Sound-Elemente des Charakters
    character.walking_sound.muted = mute;
    character.jumping_sound.muted = mute;
    character.dead_sound.muted = mute;
    character.hurt_sound.muted = mute;
}

function backToStart() {
    location.reload();
}

// Tastatursteuerung (unverändert)
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