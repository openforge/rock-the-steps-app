import { CONFIG } from '@openforge/shared-phaser-singleton';
import { Scene } from 'phaser';

import { FLOOR_KEY } from '../../constants/game-keys.constants';

export class Floor {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, x: number, y: number, floorNumber: number) {
        console.warn('floor constructed ');
        // * have to specify the width to make it full
        this.sprite = scene.add.tileSprite(x, y, 0, 0, FLOOR_KEY);
        this.sprite.setScale(CONFIG.DEFAULT_WIDTH / this.sprite.width);
        this.sprite.setOrigin(-1, y);
        // * Set the floor height responsively as 10% less than the game height
        // eslint-disable-next-line no-magic-numbers
        this.sprite.setPosition(x, CONFIG.DEFAULT_HEIGHT - CONFIG.DEFAULT_HEIGHT * (0.1 * floorNumber));
        scene.physics.add.existing(this.sprite, true);
    }
}
