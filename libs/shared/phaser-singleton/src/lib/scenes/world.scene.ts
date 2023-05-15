/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
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
    private floorGroup: Phaser.Physics.Arcade.StaticGroup; // * Group of sprites for the floor
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    private isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    private isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    private isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    private isOnFloor: boolean = false; // * Flag to detect is character is on floor
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
            // * Now load the floor image
            this.load.image(this.flatBackgroundKey, this.flatBackgroundAsset);
            // * Now load the bushes image
            this.load.image(this.bushesBackgroundKey, this.bushesBackgroundAsset);
            // * Load the obstacles and the player
            this.load.atlas('objects-sprite', `assets/objects/${GameEngineSingleton.world.worldType}.png`, `assets/objects/${GameEngineSingleton.world.worldType}.json`);
            this.load.atlas('character-sprite', `assets/character/character-sprite.png`, `assets/character/character-sprite.json`);
            //load buttons
            this.load.image('jump', `assets/buttons/jump.png`);
            this.load.atlas('controls', `assets/buttons/controls.png`, `assets/buttons/controls.json`);
        } catch (e) {
            console.error('preloader.scene.ts', 'error preloading', e);
        }
    }

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        console.log('forge.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height, PhaserSingletonService.activeGame);

        const [cityBackground, bushesBackground] = this.setBackgrounds();
        this.createAnimationsCharacter();
        // Create the infinite floor
        this.createFloor();
        this.createButtons();
        // We add the sprite into the scene
        this.player = this.physics.add.sprite(50, 420, 'character-sprite');
        this.player.setVelocityY(-150);
        this.player.setScale(2, 2);
        this.physics.add.collider(this.player, this.floorGroup, this.onCollideWithFloor, null, this);
        this.player.anims.play('walking', true);
        // * Register our custom scroll manager
        this.scrollManager = new ScrollManager(this);
        this.scrollManager.registerScrollingBackground(cityBackground);
        // * Set cameras to the correct position
        this.scale.on('resize', this.resize, this);
        // this.cameras.main.setBackgroundColor('#ff0000');
        // * Starting the city infinite movement
        this.startInfiniteMovement([cityBackground, bushesBackground]);
    }

    private onCollideWithFloor(): void {
        // this.isOnFloor = true;
        // this.isJumping = false;
    }

    /**
     * Method used to create the buttons of movement and jump
     *
     * @private
     */
    private createButtons(): void {
        const buttonLeft = this.add.sprite(100, window.innerHeight - 100, 'controls', 'left');
        buttonLeft.setInteractive();
        buttonLeft.on('pointerdown', () => (this.isMovingLeft = true), this);
        buttonLeft.on('pointerup', () => (this.isMovingLeft = false), this);
        const buttonRight = this.add.sprite(300, window.innerHeight - 100, 'controls', 'right');
        buttonRight.setInteractive();
        buttonRight.on('pointerdown', () => (this.isMovingRight = true), this);
        buttonRight.on('pointerup', () => (this.isMovingRight = false), this);
        const buttonJump = this.add.sprite(window.innerWidth - 200, window.innerHeight - 100, 'jump');
        buttonJump.setInteractive();
        buttonJump.on('pointerdown', () => (this.isJumping = true), this);
        buttonJump.on('pointerup', () => (this.isJumping = false), this);
    }

    private createAnimationsCharacter(): void {
        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNames('character-sprite', {
                prefix: 'walk',
                end: 3,
                zeroPad: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNames('character-sprite', {
                prefix: 'jump',
                end: 0,
                zeroPad: 3,
            }),
            frameRate: 3,
            repeat: 0,
        });
        this.anims.create({
            key: 'damaged',
            frames: this.anims.generateFrameNames('character-sprite', {
                prefix: 'damage',
                end: 0,
                zeroPad: 3,
            }),
            repeat: -1,
        });
    }
    update() {
        // Move the ground to the left of the screen and once it is off of screen adds it next the current one
        this.floorGroup.children.iterate((floorSprite: Phaser.GameObjects.Sprite) => {
            floorSprite.x -= 2;
            // IF an sprite go out completely from screen then add it at the end
            if (floorSprite.x <= -floorSprite.width) {
                floorSprite.x += floorSprite.width * this.floorGroup.getLength();
            }
        });
        this.evaluateMovement();
    }

    private evaluateMovement(): void {
        if (this.isMovingLeft) {
            this.player.flipX = true;
            this.player.setVelocityX(-200);
        } else if (this.isMovingRight) {
            this.player.flipX = false;
            this.player.setVelocityX(200);
        } else {
            if (this.player.body.touching.down) {
                this.player.setVelocityX(0);
                this.player.play('walking', true);
            }
        }
        if (this.isJumping && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
            this.player.play('jumping');
        }
    }

    /**
     * Method used to create the infinite ground
     *
     * @return void
     */
    private createFloor(): void {
        // Create a group of sprites to represent the infinite ground
        this.floorGroup = this.physics.add.staticGroup();
        const textureWidth = this.textures.get(this.flatBackgroundKey).getSourceImage().width;
        const textureHeight = this.textures.get(this.flatBackgroundKey).getSourceImage().height;
        // Calculates the amount of sprites needed to cover the screen
        const numSprites = Math.ceil(window.innerWidth / textureWidth);
        // Adds the sprites individually to the group and configs them as immutables
        for (let i = 0; i < numSprites; i++) {
            const floorSprite: any = this.floorGroup.create(i * textureWidth, (PhaserSingletonService.activeGame.config.height as number) - textureHeight * 4, this.flatBackgroundKey);
            floorSprite.setScale(4);
            floorSprite.setOrigin(0.3, 0);
            floorSprite.setImmovable(true);
        }
    }

    /**
     * Method used to setup the backgrounds to be displayed in each level
     *
     * @returns Phaser.GameObjects.Image[] returns the city and the bushes
     * TODO: Bushes should popup randomly
     */
    private setBackgrounds(): Phaser.GameObjects.Image[] {
        // * Setup the Sky Background Image
        const skyBackground = this.add.image(0, 0, this.skyBackgroundKey);
        const scaleX = window.innerWidth / skyBackground.width;
        const scaleY = window.innerHeight / skyBackground.height;
        skyBackground.setScale(scaleX, scaleY);
        // * Setup the City Background Image
        const cityBackground = this.add.image(400, 110, this.cityBackgroundKey);
        cityBackground.setScale(2.3, 1.3);
        cityBackground.setY(350);

        // * Setup the bushes background Image
        const bushesBackground = this.add.image(0, 360, this.bushesBackgroundKey);
        bushesBackground.setDisplaySize(2500, 400);
        return [cityBackground, bushesBackground];
    }

    /**
     * * Function to start the infinite movement of an object
     *
     * @param cityBackground as Phaser.GameObjects.Image
     * */
    private startInfiniteMovement(cityBackground: Phaser.GameObjects.Image[]): void {
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
