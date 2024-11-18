/**
 * StatusBar class displays the status of health, coins, bottles, and the endboss.
 */
class StatusBar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];
    
    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    IMAGES_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/green/green0.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green100.png'
    ];

    percentage = 100;  
    type;              
    maxItems;          
    currentItems = 0;  

    /**
     * Initializes the StatusBar with a specified type (health, coin, bottle, or endboss) and optional max items.
     * @param {string} type - Type of status bar to display (e.g., health, coin).
     * @param {number} maxItems - Maximum items for collectible status bars (default is 10).
     */
    constructor(type, maxItems = 10) {
        super();
        this.type = type;
        this.maxItems = maxItems; 
        if (type === 'health') {
            this.loadImages(this.IMAGES_HEALTH);
            this.setPercentage(100);  
            this.x = 40;
            this.y = 0;  
        } else if (type === 'coin') {
            this.loadImages(this.IMAGES_COIN);
            this.setPercentage(0);  
            this.x = 40;
            this.y = 60;  
        } else if (type === 'bottle') {
            this.loadImages(this.IMAGES_BOTTLE);
            this.setPercentage(0);  
            this.x = 40;
            this.y = 120; 
        } else if (type === 'endboss') {
            this.loadImages(this.IMAGES_ENDBOSS);
            this.setPercentage(100);  
            this.x = 480;  
            this.y = 5;    
        }
        this.width = 200;
        this.height = 60;
    }

    /**
     * Increases the current items collected and updates the status bar's display accordingly.
     */
    collectItem() {
        if (this.currentItems < this.maxItems) {
            this.currentItems++;  
            let percentage = (this.currentItems / this.maxItems) * 100;
            this.setPercentage(percentage);  
        }
        
    }

    /**
     * Decreases the current items (e.g., when using bottles) and updates the status bar's display.
     */
    useItem() {
        if (this.currentItems > 0) {
            this.currentItems--;  
            let percentage = (this.currentItems / this.maxItems) * 100;
            this.setPercentage(percentage);  
        }
    }

    /**
     * Sets the status bar display based on a given percentage, adjusting the displayed image.
     * @param {number} percentage - The percentage of the bar to fill (0-100).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100)); 
        let path;
        if (this.type === 'health') {
            path = this.IMAGES_HEALTH[this.resolveImageIndex()];
        } else if (this.type === 'coin') {
            path = this.IMAGES_COIN[this.resolveImageIndex()];
        } else if (this.type === 'bottle') {
            path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
        } else if (this.type === 'endboss') {
            path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
        }
        if (this.img !== this.imageCache[path]) {
            this.img = this.imageCache[path]; 
        }
    }
    
    /**
     * Determines the image index based on the current percentage.
     * @returns {number} Index of the image to display.
     */
    resolveImageIndex() {
        const thresholds = [0, 20, 40, 60, 80, 100];  
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (this.percentage >= thresholds[i]) {
                return i; 
            }
        }
        return 0;  
    }
    
    /**
     * Resets the status bar to initial state for coins or bottles, or full health for health/endboss.
     */
    reset() {
        if (this.type === 'coin' || this.type === 'bottle') {
            this.percentage = 0;  
            this.currentItems = 0;  
        } else {
            this.percentage = 100; 
        }
        this.setPercentage(this.percentage);  
    }
}
