import { Scene } from 'phaser';

import { FLOOR_KEY } from '../../constants/game-keys.constants';

export class Floor {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, x: number, y: number, screenWidth: number, screenHeight: number, bushesHeight: number) {
        console.log('floor constructed');
        this.sprite = scene.add.tileSprite(x, y, screenWidth, screenHeight, FLOOR_KEY);
        this.sprite.setOrigin(x, y);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(x, screenHeight - bushesHeight); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
