import { GameServices } from '@openforge/capacitor-game-services';
import {
    BG_SCALE_X,
    BG_SCALE_Y,
    BUSHES_KEY,
    BUSHES_ORIGIN_Y,
    Character,
    CHARACTER_SPRITE_KEY,
    CITY_KEY,
    CITY_ORIGIN_Y,
    CONTROLS_KEY,
    DAMAGE_MAX_VALUE,
    DAMAGE_TIMER,
    END_KEY,
    END_OBJECT_SCALE,
    FIRST_ACHIEVEMENT_ID,
    FLOOR_KEY,
    GameEnum,
    GameServicesEnum,
    HALF_DIVIDER,
    HEALTHBAR_KEY,
    HEALTHBAR_TEXTURE_PREFIX,
    INITIAL_HEALTHBAR_X,
    INITIAL_HEALTHBAR_Y,
    INITIAL_POINTS_X,
    INITIAL_POINTS_Y,
    JUMP_KEY,
    LevelsEnum,
    MOVING_X_BACKGROUNDS,
    OBJECTS_SPRITE_KEY,
    PAUSE_BUTTON,
    PLAYER_POS_X,
    PLAYER_POS_Y,
    RESIZE_EVENT,
    SKY_KEY,
    STARTER_PIXEL_FLAG,
    VELOCITY_PLAYER_WHEN_MOVING,
    WALKING_ANIMATION,
    WORLD_OBJECTS_VELOCITY,
    WORLD_SCENE,
} from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { Objects } from '../../../../data-access-model/src/lib/enums/objects.enum';
import { createAnimationsCharacter } from '../utilities/character-animation';
import { createButtons } from '../utilities/hud-helper';
import { createObjects } from '../utilities/object-creation-helper';

export class WorldScene extends Phaser.Scene {
    private flatBackgroundAsset = 'assets/city-scene/flat-level-day.png'; // * Asset url relative to the app itself
    private worldObjectGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private playerGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private character: Character = new Character(); // this is the class associated with the player
    private nextWorldObjectPixelFlag = STARTER_PIXEL_FLAG; // * Pixels flag to know if next worldObject needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    private healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    private spaceBarKey: Phaser.Input.Keyboard.Key; // Spacebar key to move the player in pc
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Cursos keys to move the player in pc

    private damageValue = 0; // * Amount of damaged received by obstacles
    private isEnd: boolean = false; // Boolean to distinguish if the end has been shown
    private isEndReached: boolean = false; // Boolean to distinguish if the end has been reached

    public cityBackgroundTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    public bushesTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function
    public floorTileSprite: Phaser.GameObjects.TileSprite; // * Used to set the image sprite and then using it into the infinite movement function

    constructor() {
        super(WORLD_SCENE);
    }

    /**
     * * Method to preload images for phaser
     * * this is a Phaser required function
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
            // * Load the objects and the player
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

    /**
     * * Phaser will only call create after all assets in Preload have been loaded
     */
    async create(): Promise<void> {
        console.log('world.scene.ts', 'Creating Assets...', this.scale.width, this.scale.height, PhaserSingletonService.activeGame);
        this.setBackgrounds();
        this.initializeBasicWorld();
        createButtons(this, this.character, this.spaceBarKey);
        createAnimationsCharacter(this.character.sprite);
        this.scale.on(RESIZE_EVENT, this.resize, this); // * Set cameras to the correct position
    }

    /**
     * * Method used to initialize the groups, player, animations,texts.
     *
     * @return void
     */
    private initializeBasicWorld(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.worldObjectGroup = this.physics.add.group();
        this.playerGroup = this.physics.add.group();
        this.spaceBarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.damageValue = 0;
        this.character.sprite = this.physics.add.sprite(PLAYER_POS_X, PLAYER_POS_Y, CHARACTER_SPRITE_KEY);
        this.healthbar = this.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.playerGroup.add(this.character.sprite);
        this.physics.add.collider(this.character.sprite, this.floorTileSprite);
        this.character.sprite.anims.play(WALKING_ANIMATION, true);
        // Display the points
        this.pointsText = this.add.text(INITIAL_POINTS_X, INITIAL_POINTS_Y, '0', { fontSize: '3rem', color: 'black' });
    }

    /**
     * * Method to used by PHASER to execute every frame refresh
     *
     * @return void
     */
    update() {
        this.calculatePoints();
        this.showInfiniteBackgrounds();
        this.character.evaluateMovement(this.cursors);
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
        if (!this.isEndReached) {
            GameEngineSingleton.points++;
            this.pointsText.setText(`${GameEngineSingleton.points}`);
        }
    }

    /**
     * * Method used to initialize the objects of the current World level
     *
     * @return void
     */
    private objectsCreation(): void {
        // Generates objects while the level does not end
        let initialX: number = this.sys.canvas.width;
        const initialY = 0;
        if (GameEngineSingleton.points > this.nextWorldObjectPixelFlag && GameEngineSingleton.points < GameEngineSingleton.world.pointsToEndLevel) {
            const worldObjectNumber = Math.floor(Math.random() * GameEngineSingleton.world.objects.length);
            const worldObject = GameEngineSingleton.world.objects[worldObjectNumber];
            initialX = this.sys.canvas.width + worldObject.spritePositionX;

            createObjects(worldObject, this, initialX, initialY, this.worldObjectGroup);

            this.nextWorldObjectPixelFlag += GameEngineSingleton.world.pixelForNextObstacle;
        }
        // Draw the museum if the goal points has been reached
        if (GameEngineSingleton.points > GameEngineSingleton.world.pointsToEndLevel && !this.isEndReached) {
            const worldObjectObj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody = this.physics.add.image(initialX, initialY, END_KEY);
            worldObjectObj.setName(END_KEY);
            worldObjectObj.setScale(END_OBJECT_SCALE);
            this.worldObjectGroup.add(worldObjectObj);
            this.isEndReached = true;
        }
        this.worldObjectGroup.setVelocityX(-WORLD_OBJECTS_VELOCITY * GameEngineSingleton.difficult);
        this.physics.add.collider(this.floorTileSprite, this.worldObjectGroup);
    }

    /**
     * Method in progress to create the objects and create the collisions
     *
     * @private
     */
    private objectsDetection(): void {
        if (this.worldObjectGroup.getChildren().length > 0) {
            this.worldObjectGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
                if (worldObject) {
                    const playerYBelow = this.character.sprite.y + this.character.sprite.height / HALF_DIVIDER;
                    const playerXStart = this.character.sprite.x - this.character.sprite.width / HALF_DIVIDER;
                    const playerXEnd = this.character.sprite.x + this.character.sprite.width / HALF_DIVIDER;
                    const worldObjectYAbove = worldObject.y - worldObject.height / HALF_DIVIDER;
                    const worldObjectXStart = worldObject.x - worldObject.width / HALF_DIVIDER;
                    const worldObjectXEnd = worldObject.x + worldObject.width / HALF_DIVIDER;
                    if (worldObject.name === END_KEY && worldObjectXEnd <= window.innerWidth) {
                        // If the end is displayed stop the movement
                        this.worldObjectGroup.setVelocityX(0);
                        this.isEnd = true;
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
                            //* If gloves is picked up destroy the asset
                            worldObject.destroy();
                            this.worldObjectGroup.remove(worldObject);
                            this.character.makeInvulnerable(this);
                        } else if (!this.character.isDamaged && !this.character.isInvulnerable) {
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
            if (GameEngineSingleton.world.worldType === LevelsEnum.DAYTIME) {
                await GameServices.unlockAchievement({ achievementID: FIRST_ACHIEVEMENT_ID });
            }
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
        worldObject.destroy(); //* If cheesesteak is picked up destroy the asset
        this.worldObjectGroup.remove(worldObject);
    }

    /**
     * Method used to receive damage to the user
     *
     * @return void
     */
    private receiveDamage(): void {
        // If is not invulnerable then affect with damage
        this.damageValue++;
        this.character.sprite.setVelocityY(-VELOCITY_PLAYER_WHEN_MOVING);
        // Make invulnerable for some seconds to avoid multi coalition
        this.character.isInvulnerable = true;
        //if no more damage is allowed send out the player!
        if (this.damageValue === DAMAGE_MAX_VALUE) {
            void this.endGame(GameEnum.LOOSE);
        }
        this.healthbar.setTexture(HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}${this.damageValue}`);
        // Set damaged flag so no other animations break damaged animation
        // Play damage animation
        this.character.isDamaged = true;
        // Stop and Delete previous same timer (IF EXISTS)
        if (this.damageTimer) {
            this.damageTimer.destroy();
        }
        //INITS the damage timer with a duration of 2sec (2000 ms)
        this.damageTimer = this.time.addEvent({
            delay: DAMAGE_TIMER,
            callback: () => {
                this.character.sprite.setVelocityY(0);
                this.character.isDamaged = false;
                this.character.isInvulnerable = false;
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
        const personajeWidth = this.character.sprite.width;

        const xMin = personajeWidth / HALF_DIVIDER; // Left limit
        const xMax = window.innerWidth - personajeWidth / HALF_DIVIDER; // right limit

        this.character.sprite.x = Phaser.Math.Clamp(this.character.sprite.x, xMin, xMax);
    }

    /**
     * Method to generate infinite backgrounds
     *
     * @return void
     */
    private showInfiniteBackgrounds(): void {
        // While the end has not reached do the scrolling of level
        if (!this.isEnd) {
            // Move the ground to the left of the screen and once it is off of screen adds it next the current one
            this.cityBackgroundTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
            this.bushesTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
            this.floorTileSprite.tilePositionX += MOVING_X_BACKGROUNDS;
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
