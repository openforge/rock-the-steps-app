import { Scene } from 'phaser';

import { FLOOR_KEY } from '../../constants/game-keys.constants';

export class Floor {
    public sprite: Phaser.GameObjects.TileSprite;
    private floor_asset = 'assets/city-scene/flat-sidewalk.png'; // * Asset url relative to the app itself

    constructor(scene: Scene, x: number, y: number, width: number, height: number, screenWidth: number, screenHeight: number) {
        console.log('floor constructed');
        scene.load.image(FLOOR_KEY, this.floor_asset); // * load the floor image
        // * Creating the tileSprite of the floor
        this.sprite = scene.add.tileSprite(x, y, width, height, FLOOR_KEY);
        this.sprite.setOrigin(x, y);
        // * We need to set the size to avoid duplications
        this.sprite.setSize(screenWidth, screenHeight);
        // * Set the position of the image to the bottom to simulate that is on the floor
        this.sprite.setPosition(x, screenHeight - height);
        scene.physics.add.existing(this.sprite, true);
    }
}
