/**
 * Intro_Outro class manages the display of the intro, game-over, and win screens.
 */
class Intro_Outro {
    
    /**
     * Initializes the Intro_Outro instance with the canvas and context, and hides the restart button.
     * @param {HTMLCanvasElement} canvas - The game's canvas element.
     * @param {CanvasRenderingContext2D} ctx - The canvas 2D context for drawing.
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx; 
        this.restartButton = document.getElementById('restartButton');
        this.hideRestartButton();
    }
    
    /**
     * Displays the Game Over screen image in the center of the canvas and shows the restart button.
     */
    showGameOverScreen() {
        if (this.showingGameOverScreen) return;  
        this.showingGameOverScreen = true;    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new Image();
        img.src = 'img/9_intro_outro_screens/game_over/game over!.png';
        img.onload = () => {
            let scaleFactor = 0.5;
            let width = img.width * scaleFactor;
            let height = img.height * scaleFactor;
            let x = (this.canvas.width - width) / 2;
            let y = (this.canvas.height - height) / 2;
            this.ctx.drawImage(img, x, y, width, height);
            this.showRestartButton();
        };
    }
    
    /**
     * Displays the Win screen image in the center of the canvas and shows the restart button.
     */
    showWinScreen() {
        if (this.showingWinScreen) return; 
        this.showingWinScreen = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new Image();
        img.src = 'img/9_intro_outro_screens/win/win_1.png';
        img.onload = () => {
            let scaleFactor = 0.5;  
            let width = img.width * scaleFactor;
            let height = img.height * scaleFactor;
            let x = (this.canvas.width - width) / 2;
            let y = (this.canvas.height - height) / 2;
            this.ctx.drawImage(img, x, y, width, height);
            this.showRestartButton();
        };
    }

    /**
     * Displays the restart button.
     */
    showRestartButton() {
        this.restartButton.style.display = 'block'; 
    }

    /**
     * Hides the restart button.
     */
    hideRestartButton() {
        if (this.restartButton) {
            this.restartButton.style.display = 'none';
        }
    }
}