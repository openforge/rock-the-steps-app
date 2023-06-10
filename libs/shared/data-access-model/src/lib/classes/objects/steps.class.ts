import { Scene } from 'phaser';

import { STEPS_KEY } from '../../constants/game-keys.constants';

export class Steps {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, totalWidth: number, bushesHeight: number, screenWidth: number, screenHeight: number) {
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, totalWidth, bushesHeight, STEPS_KEY);
        this.sprite.setOrigin(0, 0);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(0, screenHeight - bushesHeight); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
