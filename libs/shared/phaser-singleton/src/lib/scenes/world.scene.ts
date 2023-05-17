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
    private floorGroup: Phaser.Physics.Arcade.StaticGroup; // * Group of sprites for the floor
    private cityGroup: Phaser.Physics.Arcade.StaticGroup; // * Group of sprites for the city background
    private bushesGroup: Phaser.Physics.Arcade.StaticGroup; // * Group of sprites for the bushes background
    private obstaclesGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private playerGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    private isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    private isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    private isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    private isOnFloor: boolean = false; // * Flag to detect is character is on floor
    private nextObstaclePixelFlag = 0; // * Pixels flag to know if newxt obstacle needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private scrollManager: ScrollManager; // * Custom openforge utility for handling scroll

    constructor() {
        super({ key: 'preloader' });
    }

    /**
     * Method to preload images for phaser
     *
     * @return void
     */
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

    /**     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        console.log('forge.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height, PhaserSingletonService.activeGame);

        this.setBackgrounds();
        this.createAnimationsCharacter();
        // Create the infinite floor
        this.createFloor();
        this.createButtons();
        this.obstaclesGroup = this.physics.add.group();
        this.playerGroup = this.physics.add.group();
        // We add the sprite into the scene
        this.player = this.physics.add.sprite(50, 420, 'character-sprite');
        this.player.setScale(2);
        this.playerGroup.add(this.player);
        this.physics.add.collider(this.player, this.floorGroup);
        this.player.anims.play('walking', true);
        // Display the points
        this.pointsText = this.add.text(100, 100, '0', { fontSize: '3rem', color: 'black' });
        // * Set cameras to the correct position
        this.scale.on('resize', this.resize, this);
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
    /**
     * Method used to generate the animations of the player
     *
     * @return void
     */
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
    /**
     * Method to used by PHASER to execute every frame refresh
     *
     * @return void
     */
    update() {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        GameEngineSingleton.points += 2;
        this.pointsText.setText(`${GameEngineSingleton.points}`);
        this.showInfiniteBackgrounds();
        this.evaluateMovement();
        this.avoidOutOfBounds();
        this.obstacleDetection();
    }

    /**
     * Method in progress to create the obstacles and create the collisions
     *
     * @private
     */
    private obstacleDetection(): void {
        // console.log(this.points , this.nextObstaclePixelFlag)
        if (GameEngineSingleton.points > this.nextObstaclePixelFlag) {
            const obstacleNumber = Math.floor(Math.random() * GameEngineSingleton.world.obstacles.length);
            const obstacle = GameEngineSingleton.world.obstacles[obstacleNumber];
            const obstacleObj = this.physics.add.image(window.innerWidth + 140, 620, obstacle.name);
            obstacleObj.setVelocityX(-200 * GameEngineSingleton.difficult);
            this.obstaclesGroup.add(obstacleObj);
            this.obstaclesGroup.setVelocityX(-150);
            this.physics.add.collider(this.floorGroup, this.obstaclesGroup);
            this.physics.collide(this.playerGroup, this.obstaclesGroup, this.collisionObstacle);
            this.nextObstaclePixelFlag += 200;
        }
    }

    /**
     * Method to avoid player go outside scene
     *
     * @return void
     */
    private avoidOutOfBounds(): void {
        const personajeWidth = this.player.width;

        const xMin = personajeWidth / 2; // Left limit
        const xMax = window.innerWidth - personajeWidth / 2; // right limit

        this.player.x = Phaser.Math.Clamp(this.player.x, xMin, xMax);
    }

    /**
     * Method to reduce the health after player crashes with obstacle
     *
     * @return void
     */
    private collisionObstacle(): void {
        console.log('Collision');
    }

    /**
     * Method to generate infinite backgrounds
     *
     * @return void
     */
    private showInfiniteBackgrounds(): void {
        // Move the ground to the left of the screen and once it is off of screen adds it next the current one
        this.floorGroup.children.iterate((floorSprite: Phaser.GameObjects.Sprite) => {
            floorSprite.x -= 2;
            // IF an sprite go out completely from screen then add it at the end
            if (floorSprite.x <= -floorSprite.width) {
                floorSprite.x += floorSprite.width * this.floorGroup.getLength();
            }
        });
        this.cityGroup.children.iterate((citySprite: Phaser.GameObjects.Sprite) => {
            citySprite.x -= 2;
            // IF an sprite go out completely from screen then add it at the end
            if (citySprite.x <= -citySprite.width) {
                citySprite.x += (citySprite.width / 2.5) * this.floorGroup.getLength();
            }
        });
        this.bushesGroup.children.iterate((bushesSprite: Phaser.GameObjects.Sprite) => {
            bushesSprite.x -= 2;
            // IF an sprite go out completely from screen then add it at the end
            if (bushesSprite.x <= -bushesSprite.width) {
                bushesSprite.x += (bushesSprite.width / 2.5) * this.floorGroup.getLength();
            }
        });
    }

    /**
     * Method to that performs behaviors of player depending of flags
     *
     * @return void
     */
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
            this.player.setVelocityY(-600);
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
            const floorSprite = this.floorGroup.create(i * textureWidth, (PhaserSingletonService.activeGame.config.height as number) - textureHeight * 4, this.flatBackgroundKey);
            floorSprite.setScale(4.6);
            floorSprite.setOrigin(0, 0.13);
            floorSprite.setImmovable(true);
        }
    }

    /**
     * Method used to setup the backgrounds to be displayed in each level
     *
     * @returns Phaser.GameObjects.Image[] returns the city and the bushes
     */
    private setBackgrounds(): void {
        // * Setup the Sky Background Image
        const skyBackground = this.add.image(0, 0, this.skyBackgroundKey);
        // const scaleX = window.innerWidth / skyBackground.width;
        // const scaleY = window.innerHeight / skyBackground.height;
        skyBackground.setScale(2.5, 12);
        // * Setup the City Background Image
        const cityWidth = this.textures.get(this.cityBackgroundKey).getSourceImage().width;
        const cityHeight = this.textures.get(this.cityBackgroundKey).getSourceImage().height;
        this.cityGroup = this.physics.add.staticGroup();
        const numCitySprites = Math.ceil(window.innerWidth / cityWidth);
        for (let i = 0; i < numCitySprites; i++) {
            const citySprite = this.cityGroup.create(i * cityWidth * 1.2, (PhaserSingletonService.activeGame.config.height as number) - cityHeight * 1.3, this.cityBackgroundKey);
            citySprite.setScale(1.2, 3.3);
            citySprite.setOrigin(0, 0.3);
            citySprite.setImmovable(true);
        }

        // * Setup the bushes background Image
        const bushesWidth = this.textures.get(this.bushesBackgroundKey).getSourceImage().width;
        const bushesHeight = this.textures.get(this.bushesBackgroundKey).getSourceImage().height;
        // const bushesScaleX = window.innerWidth / bushesWidth;
        // const bushesScaleY = window.innerHeight / bushesHeight;
        this.bushesGroup = this.physics.add.staticGroup();
        const numBushesSprites = Math.ceil(window.innerWidth / bushesWidth);
        for (let i = 0; i < numBushesSprites; i++) {
            const bushesSprite = this.bushesGroup.create(i * bushesWidth, (PhaserSingletonService.activeGame.config.height as number) - bushesHeight, this.bushesBackgroundKey);
            bushesSprite.setOrigin(0, 0.3);
            bushesSprite.setScale(1.5);
            bushesSprite.setImmovable(true);
        }
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
