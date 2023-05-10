/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import * as Phaser from 'phaser';

import { ScrollManager } from '../utilities/scroll-manager';

export class WorldScene extends Phaser.Scene {
    private cityBackgroundKey = 'background-image'; // * Store the background image name
    private skyBackgroundKey = 'citySky'; // * Store the background image name
    private cityBackgroundAsset = 'assets/city-scene/city-day.png'; // * Asset url relative to the app itself
    private skyBackgroundAsset = 'assets/city-scene/sky-day.png'; // * Asset url relative to the app itself
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    // private blackSmith: Blacksmith; // * We only have a single blacksmith in this game
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
        // * Register our custom scroll manager
        this.scrollManager = new ScrollManager(this);
        this.scrollManager.registerScrollingBackground(cityBackground);
        // * Set cameras to the correct position
        this.cameras.main.setZoom(0.6);
        this.scale.on('resize', this.resize, this);
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
