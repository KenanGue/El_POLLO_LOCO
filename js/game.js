let canvas;
let world;
let keyboard;
let isMuted = false;
let startScreen = 'img/9_intro_outro_screens/start/startscreen_1.png';

/**
 * Initializes the game by setting up the canvas, displaying the intro screen, and preparing sound controls.
 */
function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    keyboard.bindBtsPressEvents(); // Sicherstellen, dass die Buttons gebunden werden
    showIntro();
    setupSoundButton();
}

/**
 * Displays the introductory screen with the game’s start image.
 */
function showIntro() {
    let ctx = canvas.getContext('2d');
    let introImage = new Image();
    introImage.src = startScreen;
    introImage.onload = () => {
        ctx.drawImage(introImage, 0, 0, canvas.width, canvas.height);
    };
    document.getElementById('startButton').style.display = 'block';
}

/**
 * Begins the game by hiding the start button and initializing the World instance.
 */
function startGame() {
    document.getElementById('startButton').style.display = 'none';
    initLevel();
    world = new World(canvas, keyboard);
    isMuted = localStorage.getItem('isMuted') === 'true';
    muteCharacterSounds(isMuted);
    document.getElementById('soundIcon').src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
    playBackgroundMusic();
}

function restartGame() {
    world.clearAllIntervals();
    world = null;
    initLevel();
    world = new World(canvas, keyboard);
    isMuted = localStorage.getItem('isMuted') === 'true';
    muteCharacterSounds(isMuted);
    document.getElementById('soundIcon').src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
    playBackgroundMusic();
}

/**
 * Plays the background music with error handling for blocked autoplay.
 */
function playBackgroundMusic() {
    const audioElement = document.getElementById('backgroundAudio');
    audioElement.muted = isMuted; 
    audioElement.play().catch(error => {
        console.error('Autoplay wurde blockiert. Benutzerinteraktion erforderlich:', error);
    });
}

/**
 * Sets up the sound toggle button, allowing the player to mute or unmute game sounds.
 */
function setupSoundButton() {
    const soundButton = document.getElementById('soundButton');
    soundButton.addEventListener('click', toggleSound);
}

/**
 * Toggles the game’s sound on or off, including the character’s sound effects.
 */
function toggleSound() {
    const audioElement = document.getElementById('backgroundAudio');
    const soundIcon = document.getElementById('soundIcon');
    if (!audioElement) {
        console.error('Audio-Element mit ID "backgroundAudio" wurde nicht gefunden.');
        return;
    }
    isMuted = !isMuted;
    audioElement.muted = isMuted;
    if (world && world.character) {
        muteCharacterSounds(isMuted);
    }
    soundIcon.src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
}

/**
 * Mutes or unmutes the character’s specific sound effects based on the mute parameter.
 * @param {boolean} mute - Whether to mute (true) or unmute (false) the character sounds.
 */
function muteCharacterSounds(mute) {
    const character = world.character;
    if (!character) {
        console.error('Character wurde nicht gefunden.');
        return;
    }
    character.walking_sound.muted = mute;
    character.jumping_sound.muted = mute;
    character.dead_sound.muted = mute;
    character.hurt_sound.muted = mute;
}

/**
 * Reloads the game to bring the player back to the start screen.
 */
function backToStart() {
    location.reload();
}

