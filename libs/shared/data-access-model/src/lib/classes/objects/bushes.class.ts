/* eslint-disable no-magic-numbers */
import { CONFIG } from '@openforge/shared-phaser-singleton';
import { Scene } from 'phaser';

import { BUSHES_KEY } from '../../constants/game-keys.constants';

export class Bushes {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene) {
        const gameHeight = scene.game.config.height as unknown as number;

        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, 0, 0, BUSHES_KEY);
        this.sprite.setScale(CONFIG.DEFAULT_WIDTH / this.sprite.width);
        this.sprite.setOrigin(0, 0);
        this.sprite.setPosition(0, gameHeight * 0.8); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
