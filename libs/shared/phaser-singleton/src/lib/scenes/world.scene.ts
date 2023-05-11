/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/GameEngine.singletons';
import { ScrollManager } from '../utilities/scroll-manager';

export class WorldScene extends Phaser.Scene {
    private backgroundKey = 'background-image'; // * Store the background image name
    private backgroundImage: Phaser.GameObjects.Image; // * Reference for the background image
    // private blackSmith: Blacksmith; // * We only have a single blacksmith in this game
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll

    constructor() {
        super({ key: 'preloader' });
    }

    async preload(): Promise<void> {
        try {
            console.log('world.scene.ts', 'Preloading Assets...');

            // * Now load the background image
            this.load.image(this.backgroundKey, 'assets/background/Stage-Select-Background.png');
            // * Now preload the sword images, even though we don't use it initially
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

        // * Setup the Background Image
        this.backgroundImage = this.add.image(0, 0, this.backgroundKey);
        // for await (const obstacle of GameEngineSingleton.world.obstacles) {
        //     this.add.image(0, 100, 'spritesheet', 'apple');
        // }

        // * Now handle scrolling
        this.cameras.main.setBackgroundColor('0xEBF0F3');

        // * Register our custom scroll manager
        this.scrollManager = new ScrollManager(this);
        this.scrollManager.registerScrollingBackground(this.backgroundImage);
        // * Set cameras to the correct position
        this.cameras.main.setZoom(0.5);
        this.scrollManager.scrollToCenter();

        this.scale.on('resize', this.resize, this);

        // const pipes = this.physics.add.group();
        // const spriteTexture = this.textures.get('spritesheet').getFrameNames();
        // console.log('Frame name', spriteTexture);
        // this.time.addEvent({ // crea nuevos obstáculos cada 2 segundos
        //     delay: 2000,
        //     loop: true,
        //     callback: function() {
        //         var appleBotom = pipes.create(100, 0, 'spritesheet', spriteTexture[0]).setScale(2); // Crea la tubería inferior
        //         appleBotom.setVelocityX(-200);
        //         appleBotom.setCollideWorldBounds(true);
        //         appleBotom.setImmovable(true);
        //         appleBotom.body.allowGravity = false;
        //     }
        // });
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
