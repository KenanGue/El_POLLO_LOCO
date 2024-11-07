class Intro_Outro {
    
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx; // Initialize ctx here
    }
    
    showGameOverScreen() {
        if (this.showingGameOverScreen) return;  // Verhindert mehrfachen Aufruf
        this.showingGameOverScreen = true;
    
        console.log("Game-Over-Screen wird angezeigt");  // Überprüfen, ob die Methode aufgerufen wird
    
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
        };
    }
    
    showWinScreen() {
        if (this.showingWinScreen) return;  // Verhindert mehrfachen Aufruf
        this.showingWinScreen = true;
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new Image();
        img.src = 'img/9_intro_outro_screens/win/win_1.png';
    
        img.onload = () => {
            // Bild skalieren, um es in der Mitte des Canvas anzuzeigen
            let scaleFactor = 0.5;  // Passe den Skalierungsfaktor an, um die Größe zu ändern
            let width = img.width * scaleFactor;
            let height = img.height * scaleFactor;
            let x = (this.canvas.width - width) / 2;
            let y = (this.canvas.height - height) / 2;
            this.ctx.drawImage(img, x, y, width, height);
        };
    }
}