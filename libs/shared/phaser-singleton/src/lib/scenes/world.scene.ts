/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import { GameServices } from '@openforge/capacitor-game-services';
import { GameEnum } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

// eslint-disable-next-line import/no-cycle
import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/GameEngine.singletons';
import { POINTS_TO_END_LEVEL } from '../../../../data-access-model/src/lib/constants/game.constants';
export class WorldScene extends Phaser.Scene {
    private cityBackgroundKey = 'city-background'; // * Store the background image name
    private skyBackgroundKey = 'sky-key'; // * Store the background image name
    private flatBackgroundAsset = 'assets/city-scene/flat-level-day.png'; // * Asset url relative to the app itself
    private flatBackgroundKey = 'flat-key'; // * Store the background image name
    private bushesBackgroundKey = 'bushes-key'; // * Store the background image name
    private worldObjectGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private playerGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    private isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    private isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    private isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    private isDamaged: boolean = false; // * Flag to detect is character is being damaged
    private nextWorldObjectPixelFlag = 300; // * Pixels flag to know if next worldObject needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    private healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    private damageValue = 0; // * Amount of damaged received by obstacles
    public cityBackgroundTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    public bushesTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    public floorTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Cursos keys to move the player in pc
    private endDisplayedFlag: boolean = false; // Boolean to distinguish if the end has been shown
    private endReachedFlag: boolean = false; // Boolean to distinguish if the end has been reached
    private invulnerableTimer: Phaser.Time.TimerEvent; // Timer for the gloves invulnerability
    private invulnerableFlag: boolean = false; // Flag to detect gloves invulnerability
    constructor() {
        super('WorldScene');
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
            this.load.image(this.skyBackgroundKey, `assets/city-scene/bg-${GameEngineSingleton.world.worldType}.png`);
            // * Now load the city image
            this.load.image(this.cityBackgroundKey, `assets/city-scene/city-${GameEngineSingleton.world.worldType}.png`);
            // * Now load the floor image
            this.load.image(this.flatBackgroundKey, this.flatBackgroundAsset);
            // * Now load the bushes image
            this.load.image(this.bushesBackgroundKey, `assets/city-scene/bushes-${GameEngineSingleton.world.worldType}.png`);
            // * Load the worldObjects and the player
            this.load.atlas('objects-sprite', `assets/objects/${GameEngineSingleton.world.worldType}.png`, `assets/objects/${GameEngineSingleton.world.worldType}.json`);
            this.load.atlas('character-sprite', `assets/character/character-sprite.png`, `assets/character/character-sprite.json`);
            //load buttons
            this.load.image('jump', `assets/buttons/jump.png`);
            this.load.atlas('controls', `assets/buttons/controls.png`, `assets/buttons/controls.json`);
            this.load.atlas('healthbar', `assets/objects/healthbar.png`, `assets/objects/healthbar.json`);
            this.load.image('end', 'assets/objects/end.png');
            this.load.image('pauseButton', 'assets/buttons/pause-button.png');
        } catch (e) {
            console.error('preloader.scene.ts', 'error preloading', e);
        }
    }

    /**     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        console.log('forge.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height, PhaserSingletonService.activeGame);

        this.setBackgrounds();
        this.createButtons();
        this.initializeBasicWorld();
        this.createAnimationsCharacter();
        // * Set cameras to the correct position
        this.scale.on('resize', this.resize, this);
    }

    /**
     * Method used to initialize the groups, player, animations,texts.
     *
     * @return void
     */
    private initializeBasicWorld(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.worldObjectGroup = this.physics.add.group();
        this.playerGroup = this.physics.add.group();
        // We add the sprite into the scene
        this.damageValue = 0;
        this.player = this.physics.add.sprite(50, 220, 'character-sprite');
        this.healthbar = this.add.sprite(200, 50, 'healthbar', 'healthbar00');
        // this.player.setScale(2);
        this.playerGroup.add(this.player);
        this.physics.add.collider(this.player, this.floorTileSprite);
        this.player.anims.play('walking', true);
        // Display the points
        this.pointsText = this.add.text(100, 100, '0', { fontSize: '3rem', color: 'black' });
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
        const pauseButton = this.add
            .image(this.sys.canvas.width - 30, 30, 'pauseButton')
            .setScale(0.1, 0.1)
            .setOrigin(1, 0)
            .setInteractive();
        pauseButton.on('pointerdown', this.showPauseModal, this);
    }

    /**
     * Method used to display pause modal
     *
     * @private
     */
    private showPauseModal(): void {
        // Pause the game
        GameEngineSingleton.scene = this.scene;
        this.scene.pause();
        this.scene.run('PauseScene');
    }
    /**
     * Method used to generate the animations of the player
     *
     * @return void
     */
    private createAnimationsCharacter(): void {
        this.player.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNames('character-sprite', {
                prefix: 'walk',
                end: 3,
                zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
        });
        this.player.anims.create({
            key: 'jumping',
            frames: this.anims.generateFrameNames('character-sprite', {
                prefix: 'jump',
                end: 0,
                zeroPad: 3,
            }),
            frameRate: 3,
            repeat: 0,
        });
        this.player.anims.create({
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
        this.calculatePoints();
        this.showInfiniteBackgrounds();
        this.evaluateMovement();
        this.avoidOutOfBounds();
        this.objectsCreation();
        this.objectsDetection();
        this.cleanUpObjects();
    }

    /**
     * Method used to calculate the points and update the text in the game
     *
     * @return void
     */
    private calculatePoints(): void {
        if (!this.endReachedFlag) {
            GameEngineSingleton.points++;
            this.pointsText.setText(`${GameEngineSingleton.points}`);
        }
    }

    /**
     * Method used to initialize the worldObjects of the current World level
     *
     * @return void
     */
    private objectsCreation(): void {
        // Generates objects while the level does not end
        let initialX: number = this.sys.canvas.width;
        let initialY = 0;
        if (GameEngineSingleton.points > this.nextWorldObjectPixelFlag && GameEngineSingleton.points < POINTS_TO_END_LEVEL) {
            const worldObjectNumber = Math.floor(Math.random() * GameEngineSingleton.world.worldObjects.length);
            const worldObject = GameEngineSingleton.world.worldObjects[worldObjectNumber];
            initialX = this.sys.canvas.width + worldObject.spritePositionX;
            if (worldObject.name === 'bell') {
                // Some random X of the width screen + 400 by the decreasing velocity
                initialX = this.sys.canvas.width + this.sys.canvas.width / 2;
                initialY = -this.textures.get('bell').getSourceImage().height;
            }
            const worldObjectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.physics.add.sprite(initialX, initialY, 'objects-sprite', worldObject.name);

            if (worldObject.name === 'tourist000') {
                worldObjectSprite.anims.create({
                    key: 'standing',
                    frames: this.anims.generateFrameNames('objects-sprite', {
                        prefix: 'tourist',
                        end: 2,
                        zeroPad: 3,
                    }),
                    frameRate: 3,
                    repeat: -1,
                });
                worldObjectSprite.anims.play('standing', true);
            }
            worldObjectSprite.setName(worldObject.name);
            this.worldObjectGroup.add(worldObjectSprite);

            this.nextWorldObjectPixelFlag += 200;
        }
        // Draw the museum if the goal points has been reached
        if (GameEngineSingleton.points > POINTS_TO_END_LEVEL && !this.endReachedFlag) {
            const worldObjectObj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = this.physics.add.image(initialX, initialY, 'end');
            worldObjectObj.setName('end');
            worldObjectObj.setScale(2);
            this.worldObjectGroup.add(worldObjectObj);
            this.endReachedFlag = true;
        }
        this.worldObjectGroup.setVelocityX(-150 * GameEngineSingleton.difficult);
        this.physics.add.collider(this.floorTileSprite, this.worldObjectGroup);
    }

    /**
     * Method in progress to create the worldObjects and create the collisions
     *
     * @private
     */
    private objectsDetection(): void {
        console.log(
            `Objects ${this.worldObjectGroup
                .getChildren()
                .map((value: Phaser.GameObjects.Image) => value.name)
                .join(',')}`
        );
        if (this.worldObjectGroup.getChildren().length > 0) {
            this.worldObjectGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
                if (worldObject) {
                    const playerYBelow = this.player.y + this.player.height / 2;
                    const playerXStart = this.player.x - this.player.width / 2;
                    const playerXEnd = this.player.x + this.player.width / 2;
                    const worldObjectYAbove = worldObject.y - worldObject.height / 2;
                    const worldObjectXStart = worldObject.x - worldObject.width / 2;
                    const worldObjectXEnd = worldObject.x + worldObject.width / 2;
                    if (worldObject.name === 'end' && worldObjectXEnd <= window.innerWidth) {
                        // If the end is displayed stop the movement
                        this.worldObjectGroup.setVelocityX(0);
                        this.endDisplayedFlag = true;
                    }
                    console.log(`COLLISION ${worldObject.name}`, playerXEnd >= worldObjectXStart, playerXStart <= worldObjectXEnd, playerYBelow >= worldObjectYAbove);
                    console.log('DAMAGE BOUNDS', playerXEnd, worldObjectXStart, playerXStart, worldObjectXEnd, playerYBelow, worldObjectYAbove);
                    if (playerXEnd >= worldObjectXStart && playerXStart <= worldObjectXEnd && playerYBelow >= worldObjectYAbove) {
                        //logic damage

                        if (worldObject.name === 'cheesesteak') {
                            this.healUp(worldObject);
                        } else if (worldObject.name === 'end') {
                            // If the end is tuched send to winning screen
                            void this.endGame(GameEnum.WIN);
                        } else if (worldObject.name === 'gloves') {
                            this.makeInvulnerable(worldObject);
                        } else if (!this.isDamaged && !this.invulnerableFlag) {
                            this.receiveDamage();
                        }
                    }
                }
            });
        }
    }

    private async endGame(result: GameEnum): Promise<void> {
        this.scene.stop(); // Delete modal scene
        if (result === GameEnum.WIN) {
            await GameServices.submitScore({ leaderboardId: 'openforge.rockthesteps.leaderboard.io', score: GameEngineSingleton.points });
        }
        PhaserSingletonService.activeGame.destroy(true);
        PhaserSingletonService.activeGame = undefined;
        GameEngineSingleton.gameEventBus.next(result);
    }

    /**
     * Method used to remove obstacles after off screened
     *
     * @return void
     */
    private cleanUpObjects(): void {
        this.worldObjectGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
            //cleanup
            if (worldObject && worldObject.x + worldObject.width < 0 - worldObject.width) {
                //console removing object
                worldObject.destroy();
                this.worldObjectGroup.remove(worldObject);
            }
        });
    }

    /**
     * Method used to heal up player
     *
     * @param worldObject cheesesteak to be destroyed after used
     */
    private healUp(worldObject: Phaser.GameObjects.Image): void {
        this.damageValue--;
        this.healthbar.setTexture('healthbar', `healthbar0${this.damageValue}`);
        //* If cheesesteak is picked up destroy the asset
        worldObject.destroy();
        this.worldObjectGroup.remove(worldObject);
    }

    /**
     * Method used to enable gloves
     *
     * @param worldObject gloves to be destroyed after used
     */
    private makeInvulnerable(worldObject: Phaser.GameObjects.Image): void {
        console.log('GLVOES', this.player.anims);
        //* If gloves is picked up destroy the asset
        worldObject.destroy();
        this.worldObjectGroup.remove(worldObject);
        this.invulnerableFlag = true;
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            duration: 200, // Duration of each blinking
            repeat: 15, // Number of repetitions 200 x 10 = 2000millisec
            yoyo: true, // Type of animation
            onComplete: () => {
                this.player.setAlpha(1); // Restore normal opacity
                this.invulnerableFlag = false;
            },
        });
    }

    /**
     * Method used to receive damage to the user
     *
     * @return void
     */
    private receiveDamage(): void {
        // If is not invulnerable then affect with damage
        this.damageValue++;
        this.player.setVelocityY(-200);
        // Make invulnerable for some seconds to avoid multi coalition
        this.invulnerableFlag = true;
        //if no more damage is allowed send out the player!
        if (this.damageValue === 5) {
            void this.endGame(GameEnum.LOOSE);
        }
        this.healthbar.setTexture('healthbar', `healthbar0${this.damageValue}`);
        // Set damaged flag so no other animations break damaged animation
        // Play damage animation
        this.isDamaged = true;
        // Stop and Delete previous same timer (IF EXISTS)
        if (this.damageTimer) {
            this.damageTimer.destroy();
        }
        //INITS the damage timer with a duration of 2sec (2000 ms)
        this.damageTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                this.player.setVelocityY(0);
                this.isDamaged = false;
                this.invulnerableFlag = false;
            },
            callbackScope: this,
            loop: false,
        });
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
     * Method to generate infinite backgrounds
     *
     * @return void
     */
    private showInfiniteBackgrounds(): void {
        // While the end has not reached do the scrolling of level
        if (!this.endDisplayedFlag) {
            // Move the ground to the left of the screen and once it is off of screen adds it next the current one
            this.cityBackgroundTileSprite.tilePositionX += 1;
            this.bushesTileSprite.tilePositionX += 1;
            this.floorTileSprite.tilePositionX += 1;
        }
    }

    /**
     * Method to that performs behaviors of player depending of flags
     *
     * @return void
     */
    private evaluateMovement(): void {
        if (this.isMovingLeft || this.cursors.left.isDown) {
            this.player.flipX = true;
            this.player.setVelocityX(-200);
        } else if (this.isMovingRight || this.cursors.right.isDown) {
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
        // const bushesWidth = this.textures.get(this.flatBackgroundKey).getSourceImage().width;
        const bushesHeight = this.textures.get(this.flatBackgroundKey).getSourceImage().height;
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

        // * Creating the tileSprite of the floor
        this.floorTileSprite = this.add.tileSprite(0, 0, totalWidth, bushesHeight, this.flatBackgroundKey);
        this.floorTileSprite.setOrigin(0, 0);
        // * We need to set the size to avoid duplications
        this.floorTileSprite.setSize(screenWidth, screenHeight);
        // * Set the position of the image to the bottom to simulate that is on the floor
        this.floorTileSprite.setPosition(0, screenHeight - bushesHeight);
        this.physics.add.existing(this.floorTileSprite, true);
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
