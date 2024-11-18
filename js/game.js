let canvas;
let world;
let keyboard;
let character;
let isMuted = false;
let startScreen = 'img/9_intro_outro_screens/start/startscreen_1.png';

/**
 * Handles device orientation and updates UI elements accordingly.
 */
function handleOrientation() {
    const rotateHint = document.getElementById('rotateHint');
    const mobileButtons = document.getElementById('mobileButtons');
    const canvas = document.getElementById('canvas');
    function updateUI() {
        if (window.innerWidth < window.innerHeight) {
            rotateHint.style.display = 'block';
            mobileButtons.style.display = 'none';
            canvas.style.display = 'none';
        } else {
            rotateHint.style.display = 'none';
            mobileButtons.style.display = isTouchDevice() ? 'flex' : 'none';
            canvas.style.display = 'block';
        }
    }
    updateUI();
    window.addEventListener('resize', updateUI);
    window.addEventListener('orientationchange', updateUI);
}

/**
 * Detects if the device is touch-enabled.
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Initializes settings specific to touch devices.
 */
function initTouchSettings() {
    handleOrientation();
}

/**
 * Initializes the game setup, including canvas, controls, and intro screen.
 * Configures keyboard inputs and sound settings.
 * Displays the start screen.
 * Handles touch-specific features for mobile devices.
 */
function init() {
    canvas = document.getElementById('canvas');
    keyboard = new Keyboard();
    keyboard.bindBtsPressEvents(); 
    showIntro();
    setupSoundButton();
    initTouchSettings(); 
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
    adjustAllSoundVolumes();
    isMuted = localStorage.getItem('isMuted') === 'true';
    muteCharacterSounds(isMuted);
    document.getElementById('soundIcon').src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
    playBackgroundMusic();
    if (isTouchDevice() && document.body.requestFullscreen) {
        document.body.requestFullscreen().catch((err) => {
            console.error('Fullscreen mode could not be activated:', err);
        });
    }
}

/**
 * Restarts the game by clearing all intervals, reinitializing the game world, and resetting settings.
 * 
 * This function clears any running game intervals, resets the game world, and reinitializes 
 * the game state, including the level, character, and sound settings. It also updates the 
 * sound icon based on the current mute state and resumes background music.
 */
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
    document.getElementById('backgroundAudio').volume = 0.3;
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
    const soundIcon = document.getElementById('soundIcon');
    isMuted = localStorage.getItem('isMuted') === 'true';
    soundIcon.src = isMuted ? 'img/icons/volume-off.png' : 'img/icons/volume.png';
    const audioElement = document.getElementById('backgroundAudio');
    if (audioElement) {
        audioElement.muted = isMuted;
    }

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
    localStorage.setItem('isMuted', isMuted);
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
    const gameSounds = world;
    gameSounds.pickUpBottleSound.muted = mute;
    gameSounds.pickUpCoinSound.muted = mute;
    gameSounds.chickenDead.muted = mute;
    gameSounds.bossChicken.muted = mute;
    gameSounds.winSound.muted = mute;
    gameSounds.loseSound.muted = mute;
}

/**
 * Adjusts the volume of all character-related sounds.
 * This includes walking, jumping, dead, and hurt sounds.
 * 
 * Logs an error if the character or its sounds are not initialized.
 */
function adjustCharacterSoundVolumes() {
    const character = world.character;
    if (character) {
        if (character.walking_sound) character.walking_sound.volume = 0.1;
        if (character.jumping_sound) character.jumping_sound.volume = 0.1;
        if (character.dead_sound) character.dead_sound.volume = 0.1;
        if (character.hurt_sound) character.hurt_sound.volume = 0.1;
    } else {
        console.error('Character wurde nicht gefunden.');
    }
}

/**
 * Adjusts the volume of all world-related sounds.
 * This includes sounds for picking up bottles, coins, killing chickens,
 * and boss-related events.
 * 
 * Logs an error if the world or its sounds are not initialized.
 */

function adjustWorldSoundVolumes() {
    if (world) {
        if (world.pickUpBottleSound) world.pickUpBottleSound.volume = 0.3;
        if (world.pickUpCoinSound) world.pickUpCoinSound.volume = 0.4;
        if (world.chickenDead) world.chickenDead.volume = 0.1;
        if (world.bossChicken) world.bossChicken.volume = 0.8;
        if (world.winSound) world.winSound.volume = 0.2;
        if (world.loseSound) world.loseSound.volume = 0.2;
    } else {
        console.error('World-Soundobjekte wurden nicht gefunden.');
    }
}

/**
 * Adjusts the volume of all sounds in the game.
 * This includes both character-related and world-related sounds.
 * 
 * Calls `adjustCharacterSoundVolumes` and `adjustWorldSoundVolumes` to
 * ensure all sounds are properly configured.
 */
function adjustAllSoundVolumes() {
    adjustCharacterSoundVolumes();
    adjustWorldSoundVolumes();
}

/**
 * Reloads the game to bring the player back to the start screen.
 */
function backToStart() {
    location.reload();
}

