import { GameServices } from '@openforge/capacitor-game-services';
import {
    BG_SCALE_X,
    BG_SCALE_Y,
    BUSHES_KEY,
    BUSHES_ORIGIN_Y,
    BUTTON_JUMP_X,
    BUTTON_LEFT_X,
    BUTTON_RIGHT_X,
    BUTTONS_MOVE_Y,
    CHARACTER_SPRITE_KEY,
    CITY_KEY,
    CITY_ORIGIN_Y,
    CONTROLS_KEY,
    DAMAGE_MAX_VALUE,
    DAMAGE_PREFIX,
    DAMAGE_TIMER,
    DAMAGED_ANIMATION,
    DURATION_INVULNERABLE_REP,
    END_FRAME_WALK,
    END_KEY,
    END_OBJECT_SCALE,
    FLOOR_KEY,
    FRAME_RATE_DAMAGE,
    FRAME_RATE_JUMP,
    FRAME_RATE_WALK,
    GameEnum,
    GameServicesEnum,
    HALF_DIVIDER,
    HEALTHBAR_KEY,
    HEALTHBAR_TEXTURE_PREFIX,
    HEIGHT_OF_JUMP,
    INITIAL_HEALTHBAR_X,
    INITIAL_HEALTHBAR_Y,
    INITIAL_POINTS_X,
    INITIAL_POINTS_Y,
    INVULNERABLE_REPS,
    JUMP_KEY,
    JUMP_PREFIX,
    JUMPING_ANIMATION,
    LEFT_KEY,
    MOVING_X_BACKGROUNDS,
    OBJECTS_SPRITE_KEY,
    PAUSE_BUTTON,
    PAUSE_BUTTON_X,
    PAUSE_BUTTON_Y,
    PAUSE_SCENE,
    PIXEL_X_OBSTACLE_FREQUENCY,
    PLAYER_POS_X,
    PLAYER_POS_Y,
    POINTER_DOWN_EVENT,
    POINTER_UP_EVENT,
    POINTS_TO_END_LEVEL,
    REPEAT_FRAME,
    RESIZE_EVENT,
    RIGHT_KEY,
    SCALE_PAUSE_BUTTON,
    SKY_KEY,
    STARTER_PIXEL_FLAG,
    TORUIST_END_FRAME,
    TORUIST_FRAME_KEY,
    TORUIST_FRAME_RATE,
    TOURIST_STANDING_FRAME,
    VELOCITY_PLAYER,
    VELOCITY_PLAYER_WHEN_MOVING,
    WALK_PREFIX,
    WALKING_ANIMATION,
    WORLD_OBJECTS_VELOCITY,
    WORLD_SCENE,
    ZERO_PAD_PLAYER,
    ZERO_PAD_TOURIST,
} from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/GameEngine.singletons';
import { Objects } from '../../../../data-access-model/src/lib/enums/objects.enum';

export class WorldScene extends Phaser.Scene {
    private flatBackgroundAsset = 'assets/city-scene/flat-level-day.png'; // * Asset url relative to the app itself
    private worldObjectGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private playerGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    private isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    private isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    private isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    private isDamaged: boolean = false; // * Flag to detect is character is being damaged
    private nextWorldObjectPixelFlag = STARTER_PIXEL_FLAG; // * Pixels flag to know if next worldObject needs to be drawn
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
    private invulnerableFlag: boolean = false; // Flag to detect gloves invulnerability
    constructor() {
        super(WORLD_SCENE);
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
            this.load.image(SKY_KEY, `assets/city-scene/bg-${GameEngineSingleton.world.worldType}.png`);
            // * Now load the city image
            this.load.image(CITY_KEY, `assets/city-scene/city-${GameEngineSingleton.world.worldType}.png`);
            // * Now load the floor image
            this.load.image(FLOOR_KEY, this.flatBackgroundAsset);
            // * Now load the bushes image
            this.load.image(BUSHES_KEY, `assets/city-scene/bushes-${GameEngineSingleton.world.worldType}.png`);
            // * Load the worldObjects and the player
            this.load.atlas(OBJECTS_SPRITE_KEY, `assets/objects/${GameEngineSingleton.world.worldType}.png`, `assets/objects/${GameEngineSingleton.world.worldType}.json`);
            this.load.atlas(CHARACTER_SPRITE_KEY, `assets/character/character-sprite.png`, `assets/character/character-sprite.json`);
            //load buttons
            this.load.image(JUMP_KEY, `assets/buttons/jump.png`);
            this.load.atlas(CONTROLS_KEY, `assets/buttons/controls.png`, `assets/buttons/controls.json`);
            this.load.atlas(HEALTHBAR_KEY, `assets/objects/healthbar.png`, `assets/objects/healthbar.json`);
            this.load.image(END_KEY, 'assets/objects/end.png');
            this.load.image(PAUSE_BUTTON, 'assets/buttons/pause-button.png');
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
        this.scale.on(RESIZE_EVENT, this.resize, this);
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
        this.player = this.physics.add.sprite(PLAYER_POS_X, PLAYER_POS_Y, CHARACTER_SPRITE_KEY);
        this.healthbar = this.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.playerGroup.add(this.player);
        this.physics.add.collider(this.player, this.floorTileSprite);
        this.player.anims.play(WALKING_ANIMATION, true);
        // Display the points
        this.pointsText = this.add.text(INITIAL_POINTS_X, INITIAL_POINTS_Y, '0', { fontSize: '3rem', color: 'black' });
    }

    /**
     * Method used to create the buttons of movement and jump
     *
     * @private
     */
    private createButtons(): void {
        const buttonLeft = this.add.sprite(BUTTON_LEFT_X, window.innerHeight - BUTTONS_MOVE_Y, CONTROLS_KEY, LEFT_KEY);
        buttonLeft.setInteractive();
        buttonLeft.on(POINTER_DOWN_EVENT, () => (this.isMovingLeft = true), this);
        buttonLeft.on(POINTER_UP_EVENT, () => (this.isMovingLeft = false), this);
        const buttonRight = this.add.sprite(BUTTON_RIGHT_X, window.innerHeight - BUTTONS_MOVE_Y, CONTROLS_KEY, RIGHT_KEY);
        buttonRight.setInteractive();
        buttonRight.on(POINTER_DOWN_EVENT, () => (this.isMovingRight = true), this);
        buttonRight.on(POINTER_UP_EVENT, () => (this.isMovingRight = false), this);
        const buttonJump = this.add.sprite(window.innerWidth - BUTTON_JUMP_X, window.innerHeight - BUTTONS_MOVE_Y, JUMP_KEY);
        buttonJump.setInteractive();
        buttonJump.on(POINTER_DOWN_EVENT, () => (this.isJumping = true), this);
        buttonJump.on(POINTER_UP_EVENT, () => (this.isJumping = false), this);
        const pauseButton = this.add
            .image(this.sys.canvas.width - PAUSE_BUTTON_X, PAUSE_BUTTON_Y, PAUSE_BUTTON)
            .setScale(SCALE_PAUSE_BUTTON, SCALE_PAUSE_BUTTON)
            .setOrigin(1, 0)
            .setInteractive();
        pauseButton.on(POINTER_DOWN_EVENT, this.showPauseModal, this);
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
        this.scene.run(PAUSE_SCENE);
    }
    /**
     * Method used to generate the animations of the player
     *
     * @return void
     */
    private createAnimationsCharacter(): void {
        this.player.anims.create({
            key: WALKING_ANIMATION,
            frames: this.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
                prefix: WALK_PREFIX,
                end: END_FRAME_WALK,
                zeroPad: ZERO_PAD_PLAYER,
            }),
            frameRate: FRAME_RATE_WALK,
            repeat: REPEAT_FRAME,
        });
        this.player.anims.create({
            key: JUMPING_ANIMATION,
            frames: this.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
                prefix: JUMP_PREFIX,
                end: 0,
                zeroPad: ZERO_PAD_PLAYER,
            }),
            frameRate: FRAME_RATE_JUMP,
            repeat: 0,
        });
        this.player.anims.create({
            key: DAMAGED_ANIMATION,
            frames: this.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
                prefix: DAMAGE_PREFIX,
                end: 0,
                zeroPad: ZERO_PAD_PLAYER,
            }),
            frameRate: FRAME_RATE_DAMAGE,
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
            if (worldObject.name === Objects.BELL) {
                // Some random X of the width screen + 400 by the decreasing velocity
                initialX = this.sys.canvas.width + this.sys.canvas.width / HALF_DIVIDER;
                initialY = -this.textures.get(Objects.BELL).getSourceImage().height;
            }
            const worldObjectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);

            if (worldObject.name === Objects.TOURIST) {
                worldObjectSprite.anims.create({
                    key: TOURIST_STANDING_FRAME,
                    frames: this.anims.generateFrameNames(OBJECTS_SPRITE_KEY, {
                        prefix: TORUIST_FRAME_KEY,
                        end: TORUIST_END_FRAME,
                        zeroPad: ZERO_PAD_TOURIST,
                    }),
                    frameRate: TORUIST_FRAME_RATE,
                    repeat: REPEAT_FRAME,
                });
                worldObjectSprite.anims.play(TOURIST_STANDING_FRAME, true);
            }
            worldObjectSprite.setName(worldObject.name);
            this.worldObjectGroup.add(worldObjectSprite);

            this.nextWorldObjectPixelFlag += PIXEL_X_OBSTACLE_FREQUENCY;
        }
        // Draw the museum if the goal points has been reached
        if (GameEngineSingleton.points > POINTS_TO_END_LEVEL && !this.endReachedFlag) {
            const worldObjectObj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = this.physics.add.image(initialX, initialY, END_KEY);
            worldObjectObj.setName(END_KEY);
            worldObjectObj.setScale(END_OBJECT_SCALE);
            this.worldObjectGroup.add(worldObjectObj);
            this.endReachedFlag = true;
        }
        this.worldObjectGroup.setVelocityX(-WORLD_OBJECTS_VELOCITY * GameEngineSingleton.difficult);
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
                    const playerYBelow = this.player.y + this.player.height / HALF_DIVIDER;
                    const playerXStart = this.player.x - this.player.width / HALF_DIVIDER;
                    const playerXEnd = this.player.x + this.player.width / HALF_DIVIDER;
                    const worldObjectYAbove = worldObject.y - worldObject.height / HALF_DIVIDER;
                    const worldObjectXStart = worldObject.x - worldObject.width / HALF_DIVIDER;
                    const worldObjectXEnd = worldObject.x + worldObject.width / HALF_DIVIDER;
                    if (worldObject.name === END_KEY && worldObjectXEnd <= window.innerWidth) {
                        // If the end is displayed stop the movement
                        this.worldObjectGroup.setVelocityX(0);
                        this.endDisplayedFlag = true;
                    }
                    // console.log(`COLLISION ${worldObject.name}`, playerXEnd >= worldObjectXStart, playerXStart <= worldObjectXEnd, playerYBelow >= worldObjectYAbove);
                    // console.log('DAMAGE BOUNDS', playerXEnd, worldObjectXStart, playerXStart, worldObjectXEnd, playerYBelow, worldObjectYAbove);
                    if (playerXEnd >= worldObjectXStart && playerXStart <= worldObjectXEnd && playerYBelow >= worldObjectYAbove) {
                        //logic damage

                        if (worldObject.name === Objects.CHEESESTEAK) {
                            this.healUp(worldObject);
                        } else if (worldObject.name === END_KEY) {
                            // If the end is tuched send to winning screen
                            void this.endGame(GameEnum.WIN);
                        } else if (worldObject.name === Objects.GLOVES) {
                            this.makeInvulnerable(worldObject);
                        } else if (!this.isDamaged && !this.invulnerableFlag) {
                            this.receiveDamage();
                        }
                    }
                }
            });
        }
    }

    /**
     * Method used to send the user back to the main screen
     *
     * @param result Result of the game reached WIN/LOSE
     * @return void
     */
    private async endGame(result: GameEnum): Promise<void> {
        this.scene.stop(); // Delete modal scene
        PhaserSingletonService.activeGame.destroy(true);
        PhaserSingletonService.activeGame = undefined;
        GameEngineSingleton.gameEventBus.next(result);
        if (result === GameEnum.WIN) {
            await GameServices.submitScore({ leaderboardId: GameServicesEnum.LEADERBOARDS_ID, score: GameEngineSingleton.points });
        }
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
        this.healthbar.setTexture(HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}${this.damageValue}`);
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
        //* If gloves is picked up destroy the asset
        worldObject.destroy();
        this.worldObjectGroup.remove(worldObject);
        this.invulnerableFlag = true;
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            duration: DURATION_INVULNERABLE_REP, // Duration of each blinking
            repeat: INVULNERABLE_REPS, // Number of repetitions 200 x 10 = 2000millisec
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
        this.player.setVelocityY(-VELOCITY_PLAYER_WHEN_MOVING);
        // Make invulnerable for some seconds to avoid multi coalition
        this.invulnerableFlag = true;
        //if no more damage is allowed send out the player!
        if (this.damageValue === DAMAGE_MAX_VALUE) {
            void this.endGame(GameEnum.LOOSE);
        }
        this.healthbar.setTexture(HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}${this.damageValue}`);
        // Set damaged flag so no other animations break damaged animation
        // Play damage animation
        this.isDamaged = true;
        // Stop and Delete previous same timer (IF EXISTS)
        if (this.damageTimer) {
            this.damageTimer.destroy();
        }
        //INITS the damage timer with a duration of 2sec (2000 ms)
        this.damageTimer = this.time.addEvent({
            delay: DAMAGE_TIMER,
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

        const xMin = personajeWidth / HALF_DIVIDER; // Left limit
        const xMax = window.innerWidth - personajeWidth / HALF_DIVIDER; // right limit

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
            this.cityBackgroundTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
            this.bushesTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
            this.floorTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
        }
    }

    /**
     * Method to that performs behaviors of player depending on flags
     *
     * @return void
     */
    private evaluateMovement(): void {
        if (this.isMovingLeft || this.cursors.left.isDown) {
            this.player.flipX = true;
            this.player.setVelocityX(-VELOCITY_PLAYER_WHEN_MOVING);
        } else if (this.isMovingRight || this.cursors.right.isDown) {
            this.player.flipX = false;
            this.player.setVelocityX(VELOCITY_PLAYER_WHEN_MOVING);
        } else if (this.isDamaged) {
            this.player.play(DAMAGED_ANIMATION);
        } else {
            if (this.player.body.touching.down) {
                this.player.setVelocityX(-VELOCITY_PLAYER);
                this.player.play(WALKING_ANIMATION, true);
            }
        }
        if (this.isJumping && this.player.body.touching.down) {
            this.player.setVelocityY(-HEIGHT_OF_JUMP);
            this.player.play(JUMPING_ANIMATION);
        }
    }

    /**
     * Method used to setup the backgrounds to be displayed in each level
     *
     * @returns Phaser.GameObjects.Image[] returns the city and the bushes
     */
    private setBackgrounds(): void {
        // * Setup the Sky Background Image
        const skyBackground = this.add.image(0, 0, SKY_KEY);
        skyBackground.setScale(BG_SCALE_X, BG_SCALE_Y);

        // * Setup the City Background Image
        const screenWidth = this.sys.canvas.width; // * To get the width of the current screen
        const screenHeight = this.sys.canvas.height; // * To get the height of the current screen
        const totalWidth = screenWidth * HALF_DIVIDER; // * We need to adjust this based on the desired scrolling speed
        const bushesHeight = this.textures.get(FLOOR_KEY).getSourceImage().height;
        // * Creating the tileSprite of the city background
        this.cityBackgroundTileSprite = this.add.tileSprite(0, 0, totalWidth, screenHeight, CITY_KEY);
        this.cityBackgroundTileSprite.setOrigin(0, CITY_ORIGIN_Y);
        // * We need to set the size to avoid duplications
        this.cityBackgroundTileSprite.setSize(screenWidth, screenHeight);
        this.cityBackgroundTileSprite.setPosition(0, screenHeight / HALF_DIVIDER);

        // * Creating the tileSprite of the bushes
        this.bushesTileSprite = this.add.tileSprite(0, 0, totalWidth, screenHeight, BUSHES_KEY);
        this.bushesTileSprite.setOrigin(0, BUSHES_ORIGIN_Y);
        // * We need to set the size to avoid duplications
        this.bushesTileSprite.setSize(screenWidth, screenHeight);
        // * Set the position of the image to the bottom to simulate that is on the floor
        this.bushesTileSprite.setPosition(0, screenHeight / HALF_DIVIDER);

        // * Creating the tileSprite of the floor
        this.floorTileSprite = this.add.tileSprite(0, 0, totalWidth, bushesHeight, FLOOR_KEY);
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
