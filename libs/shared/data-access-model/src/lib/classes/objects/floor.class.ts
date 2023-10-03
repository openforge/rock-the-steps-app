import { CONFIG } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { FLOOR_KEY } from '../../constants/game-keys.constants';
import { FLOOR_SCREEN_TARGET_PERCENTAGE } from '../../constants/game-units.constants';
import { Character } from '../character/character';

export class Floor {
    public sprite: Phaser.GameObjects.TileSprite | Phaser.Physics.Arcade.Sprite; // * Object sprite

    constructor(scene: Phaser.Scene, x: number, y: number, floorNumber: number, obstacleGroup?: Phaser.Physics.Arcade.Group, character?: Character, firstFloor?: Floor, secondFloor?: Floor) {
        console.log('floor.class.ts', 'constructor()', floorNumber);
        // * have to specify the width to make it full
        if (floorNumber === 1) this.sprite = scene.add.tileSprite(x, y, 0, 0, FLOOR_KEY);
        else {
            this.sprite = scene.physics.add.sprite(x, y, FLOOR_KEY);
        }
        const targetHeight = CONFIG.DEFAULT_HEIGHT * FLOOR_SCREEN_TARGET_PERCENTAGE;
        this.sprite.setScale(CONFIG.DEFAULT_WIDTH / this.sprite.width, targetHeight / this.sprite.height);
        this.sprite.setOrigin(0, y);
        // * Set the floor height responsively as 10% less than the game height
        if (this.sprite instanceof Phaser.Physics.Arcade.Sprite) {
            this.sprite.setImmovable(true);
        }
        const positionY = this.sprite.displayHeight * (floorNumber > 1 ? floorNumber + 1 : floorNumber);
        this.sprite.setPosition(x, CONFIG.DEFAULT_HEIGHT - positionY);

        //Give to the floor physics
        if (character) scene.physics.add.collider(this.sprite, character.sprite);
        if (firstFloor) scene.physics.add.collider(firstFloor.sprite, this.sprite);
        if (secondFloor) scene.physics.add.collider(secondFloor.sprite, this.sprite);
        // Char and obstacles now should collide with this new floor
        if (obstacleGroup) scene.physics.add.collider(this.sprite, obstacleGroup);
    }
}
