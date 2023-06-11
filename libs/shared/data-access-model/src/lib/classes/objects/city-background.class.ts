/* eslint-disable no-magic-numbers */
import { Scene } from 'phaser';

import { CITY_KEY } from '../../constants/game-keys.constants';

export class CityBackground {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, screenWidth: number, screenHeight: number) {
        console.log('city constructed');
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, screenWidth, screenHeight, CITY_KEY);
        this.sprite.setOrigin(0, 0);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(0, screenHeight / 2); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
