/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/GameEngine.singletons';
import { ScrollManager } from '../utilities/scroll-manager';

export class WorldScene extends Phaser.Scene {
    private cityBackgroundKey = 'city-background'; // * Store the background image name
    private skyBackgroundKey = 'sky-key'; // * Store the background image name
    private cityBackgroundAsset = 'assets/city-scene/city-day.png'; // * Asset url relative to the app itself
    private skyBackgroundAsset = 'assets/city-scene/sky-day.png'; // * Asset url relative to the app itself
    private flatBackgroundAsset = 'assets/city-scene/flat-level-day.png'; // * Asset url relative to the app itself
    private flatBackgroundKey = 'flat-key'; // * Store the background image name
    private bushesBackgroundAsset = 'assets/city-scene/bushes-day.png'; // * Asset url relative to the app itself
    private bushesBackgroundKey = 'bushes-key'; // * Store the background image name
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll

    constructor() {
        super({ key: 'preloader' });
    }

    async preload(): Promise<void> {
        try {
            console.log('world.scene.ts', 'Preloading Assets...');

            // * Now load the sky image
            this.load.image(this.skyBackgroundKey, this.skyBackgroundAsset);
            // * Now load the city image
            this.load.image(this.cityBackgroundKey, this.cityBackgroundAsset);
            // * Now load the flat image
            this.load.image(this.flatBackgroundKey, this.flatBackgroundAsset);
            // * Now load the bushes image
            this.load.image(this.bushesBackgroundKey, this.bushesBackgroundAsset);
            // * Load the obstacles
            this.load.atlas('spritesheet', `assets/objects/${GameEngineSingleton.world.worldType}.png`, `assets/objects/${GameEngineSingleton.world.worldType}.json`);
        } catch (e) {
            console.error('preloader.scene.ts', 'error preloading', e);
        }
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        console.log('forge.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height);

        // * Setup the Sky Background Image
        const skyBackground = this.add.image(0, 0, this.skyBackgroundKey);
        skyBackground.setScale(2, 10);

        // * Setup the Sky Background Image
        const cityBackground = this.add.image(400, 110, this.cityBackgroundKey);
        cityBackground.setScale(2.3, 1.3);
        cityBackground.setY(350);

        // * Setup the Sky Background Image
        const flatBackground = this.add.image(0, 500, this.flatBackgroundKey);
        flatBackground.setDisplaySize(2500, 150);

        // * Setup the bushes background Image
        const bushesBackground = this.add.image(0, 360, this.bushesBackgroundKey);
        bushesBackground.setDisplaySize(2500, 400);
        // * Register our custom scroll manager
        this.scrollManager = new ScrollManager(this);
        this.scrollManager.registerScrollingBackground(cityBackground);
        // * Set cameras to the correct position
        this.cameras.main.setZoom(0.6);
        this.scale.on('resize', this.resize, this);

        // * Starting the city infinite movement
        this.startInfiniteMovement([cityBackground, bushesBackground]);
    }

    /**
     * * Function to start the infinite movement of an object
     *
     * @param cityBackground as Phaser.GameObjects.Image
     * */
    private startInfiniteMovement(cityBackground: Phaser.GameObjects.Image[]) {
        const screenWidth = this.game.config.width as number;

        // * Calculate the duration based on the desired speed of movement
        const duration = screenWidth * 10;

        this.tweens.add({
            targets: cityBackground,
            x: -screenWidth,
            duration,
            repeat: -1, // Repeat indefinitely
            onCompleteScope: this,
        });
    }

    /**
     * * When the screen is resized, we
     *
     * @param gameSize
     */
    resize(gameSize: Phaser.Structs.Size): void {
        console.log('Resizing', gameSize.width, gameSize.height);
        this.cameras.resize(gameSize.width, gameSize.height);
    }
}
