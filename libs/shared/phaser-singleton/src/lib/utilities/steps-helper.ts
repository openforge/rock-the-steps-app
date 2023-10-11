import {
    Character,
    Floor,
    FLOOR_KEY,
    FLOOR_SCREEN_TARGET_PERCENTAGE,
    HALF_DIVIDER,
    STEPS_KEY,
    STEPS_OFFSET_X_FOR_CREATION,
    UPPER_FLOORS_VELOCITY,
    UPPER_FLOORS_VELOCITY_WHEN_MOVING,
} from '@openforge/shared/data-access-model';
import { CONFIG } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

/**
 * Method to create steps and draw it in the Scene
 */
export function createSteps(scene: Phaser.Scene, initialX: number, initialY: number, floorNumber: number) {
    console.log('create steps', initialX, initialY);
    const tmpSteps = scene.physics.add.image(initialX + -STEPS_OFFSET_X_FOR_CREATION, initialY, STEPS_KEY);
    const targetHeight = CONFIG.DEFAULT_HEIGHT * FLOOR_SCREEN_TARGET_PERCENTAGE;
    tmpSteps.setScale(1, targetHeight / tmpSteps.height);
    //  * First, add the steps
    tmpSteps.setOrigin(0);
    tmpSteps.setName(STEPS_KEY);
    tmpSteps.body.setImmovable(true);
    tmpSteps.setImmovable(true);
    tmpSteps.setDepth(1);
    const positionY = tmpSteps.displayHeight * floorNumber;
    tmpSteps.setPosition(initialX + -STEPS_OFFSET_X_FOR_CREATION, CONFIG.DEFAULT_HEIGHT - positionY);
    return tmpSteps;
}
/**
 * * Method used to detect if character should go up the stairs
 *
 * @private
 */
export function stepsDetection(stepsGroup: Phaser.Physics.Arcade.Group, character: Character): void {
    if (stepsGroup.getChildren().length > 0) {
        stepsGroup.children.entries.map((step: Phaser.GameObjects.Image) => {
            if (step) {
                const playerYBelow = character.sprite.y + character.sprite.height / HALF_DIVIDER;
                const stepXEnd = step.x + step.displayWidth / HALF_DIVIDER;
                const stepYAbove = step.y - step.displayHeight / HALF_DIVIDER;
                // console.log('Y values player/step', playerYBelow, stepYBelow, stepXEnd, playerXStart);
                // If player Y bottom is same or less that stairs and X is bigger than steps X then go UP!
                if (step && playerYBelow >= stepYAbove && character.sprite.x < stepXEnd && character.sprite.x > step.x) {
                    // const stepYBelow = step.y + step.height / HALF_DIVIDER;
                    // Calculated values that will be possible used for the steps
                    // const stepXStart = step.x - step.width / HALF_DIVIDER;
                    // const playerXEnd = this.character.sprite.x + this.character.sprite.width / HALF_DIVIDER;
                    // console.log('GOING UP');
                    character.sprite.setVelocityY(character.isMovingRight ? -UPPER_FLOORS_VELOCITY_WHEN_MOVING : -UPPER_FLOORS_VELOCITY);
                }
                if (step.name === STEPS_KEY && stepXEnd <= 0) {
                    stepsGroup.setVelocityX(0);
                    step.destroy();
                }
            }
        });
    }
}

/**
 * Method used for the rotation of floors and steps
 *
 */
export function floorRotation(stepsGroup: Phaser.Physics.Arcade.Group, secondFloor: Floor, thirdFloor: Floor): void {
    if (secondFloor && secondFloor.sprite.x >= -window.innerWidth) {
        secondFloor.sprite.x -= 5;
    }
    if (thirdFloor && thirdFloor.sprite.x >= -window.innerWidth) {
        thirdFloor.sprite.x -= 5;
    }
    stepsGroup.children.entries.map((el: Phaser.GameObjects.Image) => {
        if (el.x >= -window.innerWidth) {
            el.x -= 5;
        }
    });
}
export function createTileSprite(scene: Phaser.Scene, tileNumber: number): Phaser.GameObjects.TileSprite {
    const tile = scene.add.tileSprite(0, 0, 0, 0, FLOOR_KEY);
    const targetHeight = CONFIG.DEFAULT_HEIGHT * FLOOR_SCREEN_TARGET_PERCENTAGE;
    tile.setScale(CONFIG.DEFAULT_WIDTH / tile.width, targetHeight / tile.height);
    tile.setOrigin(0, 0);
    // * Set the floor height responsively as 10% less than the game height
    if (tile instanceof Phaser.Physics.Arcade.Sprite) {
        tile.setImmovable(true);
    }
    const positionY = tile.displayHeight * tileNumber;
    tile.setPosition(0, CONFIG.DEFAULT_HEIGHT - positionY);
    tile.setDepth(3);
    return tile;
}
