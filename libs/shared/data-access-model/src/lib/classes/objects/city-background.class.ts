/* eslint-disable no-magic-numbers */
import { Scene } from 'phaser';

import { CITY_KEY } from '../../constants/game-keys.constants';

export class CityBackground {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene) {
        const gameWidth = scene.game.config.width as unknown as number;
        const gameHeight = scene.game.config.height as unknown as number;
        console.log('city constructed, width & height = ', gameWidth, gameHeight);
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, gameWidth, gameHeight, CITY_KEY);
        // this.sprite.setDisplaySize(1000, 600);
        console.log('sprite.displayWidth = ', this.sprite.displayWidth);
        console.log('sprite.displayHeight = ', this.sprite.displayHeight);
        this.sprite.setOrigin(0, 0);
        this.sprite.setPosition(0, gameHeight / 8); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
