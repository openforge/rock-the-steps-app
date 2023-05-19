/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import { GameEnum } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/GameEngine.singletons';
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
    private obstaclesGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private playerGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    private isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    private isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    private isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    private isDamaged: boolean = false; // * Flag to detect is character is being damaged
    private nextObstaclePixelFlag = 300; // * Pixels flag to know if newxt obstacle needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    private healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    private damageValue = 0; // * Amount of damaged received by obstacles

    public cityBackgroundTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    public bushesTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function

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
            this.load.atlas('healthbar', `assets/objects/healthbar.png`, `assets/objects/healthbar.json`);
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
        this.healthbar = this.add.sprite(200, 50, 'healthbar', 'healthbar00');
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
            frameRate: 6,
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
            frameRate: 1,
            repeat: 0,
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
        this.obstaclesCreation();
        this.obstacleDetectionAndCleanUp();
    }

    /**
     * Method used to initialize the obstacles of the current World level
     *
     * @return void
     */
    private obstaclesCreation(): void {
        if (GameEngineSingleton.points > this.nextObstaclePixelFlag) {
            const obstacleNumber = Math.floor(Math.random() * GameEngineSingleton.world.obstacles.length + 1);
            const obstacle = GameEngineSingleton.world.obstacles[obstacleNumber];
            console.log('ADD OBSTACLE', obstacle);

            const obstacleObj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = this.physics.add.sprite(window.innerWidth + 140, 620, 'objects-sprite', obstacle.name);
            this.obstaclesGroup.add(obstacleObj);
            this.obstaclesGroup.setVelocityX(-150 * GameEngineSingleton.difficult);
            this.physics.add.collider(this.floorGroup, this.obstaclesGroup);
            this.nextObstaclePixelFlag += 200;
        }
    }

    /**
     * Method in progress to create the obstacles and create the collisions
     *
     * @private
     */
    private obstacleDetectionAndCleanUp(): void {
        if (this.obstaclesGroup.getChildren().length > 0) {
            this.obstaclesGroup.children.iterate((obstacle: Phaser.GameObjects.Image) => {
                if (obstacle) {
                    const obstacleYAbove = obstacle.y - obstacle.height / 2;
                    const playerYBelow = this.player.y + this.player.height / 2;
                    const playerXStart = this.player.x - this.player.width / 2;
                    const playerXEnd = this.player.x + this.player.width / 2;
                    const obstacleXStart = obstacle.x - obstacle.width / 2;
                    const obstacleXEnd = obstacle.x + obstacle.width / 2;
                    if (playerXStart >= obstacleXStart && playerXEnd <= obstacleXEnd && playerYBelow >= obstacleYAbove) {
                        this.damageValue++;
                        //if no more damage is allowed send out the player!
                        if (this.damageValue === 5) {
                            GameEngineSingleton.gameEventBus.next(GameEnum.LOOSE);
                        }
                        //logic damage
                        // console.log('DAMAGE', playerXStart >= obstacleXStart , playerXEnd <= obstacleXEnd , playerYBelow >= obstacleYAbove);
                        console.log('DAMAGE', playerXStart, obstacleXStart, playerXEnd, obstacleXEnd, playerYBelow, obstacleYAbove);
                        // Set damaged flag so no other animations break damaged animation
                        this.isDamaged = true;
                        // Play damage animation
                        this.healthbar.setTexture('healthbar', `healthbar0${this.damageValue}`);
                        // Stop and Delete previous same timer (IF EXISTS)
                        if (this.damageTimer) {
                            this.damageTimer.destroy();
                        }

                        //INITS the damage timer with a duration of 2sec (2000 ms)
                        this.damageTimer = this.time.addEvent({
                            delay: 400,
                            callback: () => (this.isDamaged = false),
                            callbackScope: this,
                            loop: false,
                        });
                    }
                }
                //cleanup
                if (obstacle && obstacle.x + obstacle.width < 0 - obstacle.width) {
                    //console removing object
                    obstacle.destroy();
                    this.obstaclesGroup.remove(obstacle);
                }
            });
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
        this.cityBackgroundTileSprite.tilePositionX += 1;
        this.bushesTileSprite.tilePositionX += 1;
        // Move the ground to the left of the screen and once it is off of screen adds it next the current one
        this.floorGroup.children.iterate((floorSprite: Phaser.GameObjects.Sprite) => {
            floorSprite.x -= 2;
            // IF an sprite go out completely from screen then add it at the end
            if (floorSprite.x <= -floorSprite.width) {
                floorSprite.x += floorSprite.width * this.floorGroup.getLength();
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
        } else if (this.isDamaged) {
            this.player.play('damaged');
        } else {
            if (this.player.body.touching.down) {
                this.player.setVelocityX(-100);
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
        skyBackground.setScale(2.5, 12);

        // * Setup the City Background Image
        const screenWidth = this.sys.canvas.width; // * To get the width of the current screen
        const screenHeight = this.sys.canvas.height; // * To get the height of the current screen
        const totalWidth = screenWidth * 2; // * We need to adjust this based on the desired scrolling speed

        // * Creating the tileSprite of the city background
        this.cityBackgroundTileSprite = this.add.tileSprite(0, 0, totalWidth, screenHeight, this.cityBackgroundKey);
        this.cityBackgroundTileSprite.setOrigin(0, 0.1);
        // * We need to set the size to avoid duplications
        this.cityBackgroundTileSprite.setSize(screenWidth, screenHeight);
        this.cityBackgroundTileSprite.setPosition(0, screenHeight / 2);

        // * Creating the tileSprite of the bushes
        this.bushesTileSprite = this.add.tileSprite(0, 0, totalWidth, screenHeight, this.bushesBackgroundKey);
        this.bushesTileSprite.setOrigin(0, 0.05);
        // * We need to set the size to avoid duplications
        this.bushesTileSprite.setSize(screenWidth, screenHeight);
        // * Set the position of the image to the bottom to simulate that is on the floor
        this.bushesTileSprite.setPosition(0, screenHeight / 2);
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
