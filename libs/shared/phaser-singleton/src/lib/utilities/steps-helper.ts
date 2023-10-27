import {
    Character,
    Floor,
    FLOOR_KEY,
    FLOOR_SCREEN_TARGET_PERCENTAGE,
    HALF_DIVIDER,
    STEPS_KEY,
    STEPS_OFFSET_X_FOR_CREATION,
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
        stepsGroup.children.iterate((step: Phaser.GameObjects.Image) => {
            if (step) {
                const playerXStart = character.sprite.x - character.sprite.width / HALF_DIVIDER;
                const stepXEnd = step.x + step.displayWidth / HALF_DIVIDER;
                const playerY = character.sprite.y;
                const playerBottomY = playerY + character.sprite.height;
                const stepY = step.y + step.displayHeight;
                // If player x is at least at the x of stairs AND
                // Y bottom of player is same or more than stairs (it means he is below) then go UP!
                if (step && character.sprite.x > step.x && playerXStart <= stepXEnd && playerBottomY >= stepY) {
                    character.sprite.setVelocityY(-UPPER_FLOORS_VELOCITY_WHEN_MOVING);
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
    stepsGroup.children.iterate((el: Phaser.GameObjects.Image) => {
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
    tile.setDepth(1);
    return tile;
}
