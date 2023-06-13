/* eslint-disable no-magic-numbers */
import { Scene } from 'phaser';

import { BUSHES_KEY } from '../../constants/game-keys.constants';

export class Bushes {
    public sprite: Phaser.GameObjects.TileSprite;
    public BUSHES_ORIGIN_Y = 0.05;

    constructor(scene: Scene) {
        const gameWidth = scene.game.config.width as unknown as number;
        const gameHeight = scene.game.config.height as unknown as number;
        console.log('BUSHES constructed width & height = ', gameWidth, gameHeight);
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, gameWidth, gameHeight, BUSHES_KEY);
        this.sprite.setOrigin(0, 0);
        this.sprite.setPosition(0, gameHeight * 0.31); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
