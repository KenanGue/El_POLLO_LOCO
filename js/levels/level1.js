/**
 * Level configuration for level 1.
 * Defines level length, number of chickens, background objects, and clouds.
 */
const levelLength = 7200;
const numChickens = 12;
const backgroundLength = 7200;
const cloudGap = 500;

/**
 * The main level1 object which includes enemies, clouds, and background objects.
 */
const level1 = new Level(
    [
        ...generateRandomChickenPositions(numChickens, levelLength),
        new Endboss()
    ],
    generateClouds(backgroundLength, cloudGap),
    [
        new BackgroundObject('img/5_background/layers/air.png', -719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png', 719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 4),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 5),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 5),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 6),
        new BackgroundObject('img/5_background/layers/air.png', 719 * 7),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 7),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 7),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 7),

        new BackgroundObject('img/5_background/layers/air.png', 719 * 8),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 8),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 8),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 8)
    ]);

/**
 * Generates cloud objects along the level at regular intervals.
 * @param {number} backgroundLength - The total length of the background.
 * @param {number} cloudGap - Distance between each cloud.
 * @returns {Array<Cloud>} Array of cloud objects.
 */
function generateClouds(backgroundLength, cloudGap) {
    const clouds = [];
    for (let x = 0; x < backgroundLength; x += cloudGap) {
        clouds.push(new Cloud(x));
    }
    return clouds;
}

/**
 * Generates random positions for chickens across the level.
 * Randomly assigns chicken types as either Chicken or SmallChicken.
 * @param {number} numChickens - Number of chickens to generate.
 * @param {number} levelLength - Length of the level.
 * @returns {Array<Chicken|SmallChicken>} Array of chicken objects.
 */
function generateRandomChickenPositions(numChickens, levelLength) {
    const chickens = [];
    for (let i = 0; i < numChickens; i++) {
        let randomX = Math.random() * (levelLength - 400) + 300;
        let randomChickenType = Math.random();
        if (randomChickenType < 0.5) {
            chickens.push(new Chicken(randomX));
        } else {
            chickens.push(new SmallChicken(randomX));
        }
    }
    return chickens;
}
