import { Scene } from 'phaser';

import { FLOOR_KEY } from '../../constants/game-keys.constants';

export class Floor {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, totalWidth: number, bushesHeight: number, screenWidth: number, screenHeight: number) {
        // * Creating the tileSprite of the floor
        this.sprite = scene.add.tileSprite(0, 0, totalWidth, bushesHeight, FLOOR_KEY);
        this.sprite.setOrigin(0, 0);
        // * We need to set the size to avoid duplications
        this.sprite.setSize(screenWidth, screenHeight);
        // * Set the position of the image to the bottom to simulate that is on the floor
        this.sprite.setPosition(0, screenHeight - bushesHeight);
        scene.physics.add.existing(this.sprite, true);
    }
}
