import { Scene } from 'phaser';

import { STEPS_KEY } from '../../constants/game-keys.constants';
import { CITY_ORIGIN_Y, HALF_DIVIDER } from '../../constants/game-units.constants';

export class CityBackground {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, totalWidth: number, screenWidth: number, screenHeight: number) {
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, totalWidth, screenHeight, STEPS_KEY);
        this.sprite.setOrigin(0, CITY_ORIGIN_Y);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(0, screenHeight / HALF_DIVIDER); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
