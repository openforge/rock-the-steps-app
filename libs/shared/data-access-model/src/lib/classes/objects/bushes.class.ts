import { Scene } from 'phaser';

import { BUSHES_KEY } from '../../constants/game-keys.constants';
import { BUSHES_ORIGIN_Y, HALF_DIVIDER } from '../../constants/game-units.constants';
import { GameEngineSingleton } from '../singletons/game-engine.singleton';

export class Bushes {
    public sprite: Phaser.GameObjects.TileSprite;

    constructor(scene: Scene, totalWidth: number, screenWidth: number, screenHeight: number) {
        // * Now load the bushes image
        scene.load.image(BUSHES_KEY, `assets/city-scene/bushes-${GameEngineSingleton.world.worldType}.png`);
        // * Creating the tileSprite
        this.sprite = scene.add.tileSprite(0, 0, totalWidth, screenHeight, BUSHES_KEY);
        this.sprite.setOrigin(0, BUSHES_ORIGIN_Y);
        this.sprite.setSize(screenWidth, screenHeight); // * We need to set the size to avoid duplications
        this.sprite.setPosition(0, screenHeight / HALF_DIVIDER); // * Set the position of the image to the bottom to simulate that is on the floor
        scene.physics.add.existing(this.sprite, true);
    }
}
