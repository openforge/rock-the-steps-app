/* eslint-disable no-magic-numbers */
import { CONFIG } from '@openforge/shared-phaser-singleton';
import { Scene } from 'phaser';

import { STEPS_KEY } from '../../constants/game-keys.constants';

export class Steps {
    public sprite: Phaser.GameObjects.TileSprite; // * Object sprite

    constructor(scene: Scene) {
        console.log('steps.class.ts', 'constructor()');
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, 0, 0, STEPS_KEY);
        this.sprite.setScale(CONFIG.DEFAULT_WIDTH / this.sprite.width);
        this.sprite.setOrigin(0, 0);
        this.sprite.setPosition(0, CONFIG.DEFAULT_HEIGHT * 0.1); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
