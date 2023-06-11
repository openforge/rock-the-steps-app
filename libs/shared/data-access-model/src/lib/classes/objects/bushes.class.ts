/* eslint-disable no-magic-numbers */
import { Scene } from 'phaser';

import { BUSHES_KEY } from '../../constants/game-keys.constants';

export class Bushes {
    public sprite: Phaser.GameObjects.TileSprite;
    public BUSHES_ORIGIN_Y = 0.05;

    constructor(scene: Scene, screenWidth: number, screenHeight: number) {
        console.log('bushes constructed');
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, screenWidth, screenHeight, BUSHES_KEY);
        this.sprite.setOrigin(0, 0);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(0, 100); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
