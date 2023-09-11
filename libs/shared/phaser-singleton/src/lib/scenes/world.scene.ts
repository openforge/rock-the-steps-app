/* eslint-disable no-magic-numbers */
import { GameServices } from '@openforge/capacitor-game-services';
import {
    Bushes,
    BUSHES_KEY,
    Character,
    CHARACTER_SPRITE_KEY,
    CITY_KEY,
    CityBackground,
    CONTROLS_KEY,
    DAMAGE_MAX_VALUE,
    DAMAGE_TIMER,
    END_KEY,
    END_OBJECT_SCALE,
    FIRST_ACHIEVEMENT_ID,
    Floor,
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
    OBJECTS_SPRITE_KEY,
    PAUSE_BUTTON,
    SKY_KEY,
    STARTER_PIXEL_FLAG,
    STEPS_KEY,
    VELOCITY_PLAYER_WHEN_MOVING,
    WORLD_OBJECTS_VELOCITY,
    WORLD_SCENE,
} from '@openforge/shared/data-access-model';
import { CONFIG, PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { Objects } from '../../../../data-access-model/src/lib/enums/objects.enum';
import { createAnimationsCharacter } from '../utilities/character-animation';
import { createButtons } from '../utilities/hud-helper';
import { createObjects } from '../utilities/object-creation-helper';

export class WorldScene extends Phaser.Scene {
    private obstacleGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private character: Character; // this is the class associated with the player
    private nextObstaclePoint = STARTER_PIXEL_FLAG; // * Pixels flag to know if next worldObject needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    private healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    private spaceBarKey: Phaser.Input.Keyboard.Key; // Spacebar key to move the player in pc
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Cursos keys to move the player in pc

    private damageValue = 0; // * Amount of damaged received by obstacles
    private isEnd: boolean = false; // Boolean to distinguish if the end has been shown
    private isEndReached: boolean = false; // Boolean to distinguish if the end has been reached

    public cityBackground: CityBackground; // * Used to set the image sprite and then using it into the infinite movement function
    public bushes: Bushes; // * Used to set the image sprite and then using it into the infinite movement function
    public floor: Floor; // * Used to set the image sprite and then using it into the infinite movement function
    public secondFloor: Floor;

    private stepsExist = false;

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
            this.load.image(SKY_KEY, `assets/city-scene/bg-${GameEngineSingleton.world.worldType}.png`); // * load the sky image
            this.load.image(CITY_KEY, `assets/city-scene/city-${GameEngineSingleton.world.worldType}.png`); // * load the city image
            this.load.image(FLOOR_KEY, `assets/city-scene/flat-sidewalk-${GameEngineSingleton.world.worldType}.png`); // * load the floor image
            this.load.image(BUSHES_KEY, `assets/city-scene/bushes-DAYTIME.png`); // *  load the bushes image
            this.load.image(STEPS_KEY, `assets/steps/steps-${GameEngineSingleton.world.worldType}.png`);
            // * Load the objects and the player
            this.load.atlas(OBJECTS_SPRITE_KEY, `assets/objects/${GameEngineSingleton.world.worldType}.png`, `assets/objects/${GameEngineSingleton.world.worldType}.json`);
            this.load.image(END_KEY, 'assets/objects/end.png');
            this.load.atlas(CHARACTER_SPRITE_KEY, `assets/character/character-sprite.png`, `assets/character/character-sprite.json`);
            // * load the HUD buttons
            this.load.image(JUMP_KEY, `assets/buttons/jump.png`);
            this.load.atlas(CONTROLS_KEY, `assets/buttons/controls.png`, `assets/buttons/controls.json`);
            this.load.atlas(HEALTHBAR_KEY, `assets/objects/healthbar.png`, `assets/objects/healthbar.json`);
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
        this.initializeBasicWorld();
        createButtons(this, this.character, this.spaceBarKey);
        createAnimationsCharacter(this.character.sprite);
    }

    /**
     * * Method used to initialize the groups, player, animations,texts.
     *
     * @return void
     */
    private initializeBasicWorld(): void {
        const skyBackground = this.add.image(0, 0, SKY_KEY); // * Setup the Sky Background Image
        skyBackground.setOrigin(0, 0);
        skyBackground.setDisplaySize(CONFIG.DEFAULT_WIDTH, CONFIG.DEFAULT_HEIGHT);
        skyBackground.setSize(CONFIG.DEFAULT_WIDTH, CONFIG.DEFAULT_HEIGHT);

        this.cityBackground = new CityBackground(this);
        this.bushes = new Bushes(this);
        this.floor = new Floor(this, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacleGroup = this.physics.add.group();
        this.spaceBarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.damageValue = 0;
        this.character = new Character(this, this.floor.sprite);
        this.healthbar = this.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.pointsText = this.add.text(INITIAL_POINTS_X, INITIAL_POINTS_Y, '0', { fontSize: '3vh', color: 'black' });
    }

    /**
     * * Method to used by PHASER to execute every frame refresh
     *
     * @return void
     */
    update() {
        this.calculatePoints();
        this.moveInfiniteBackgrounds();
        this.character.evaluateMovement(this.cursors);
        this.avoidOutOfBounds();
        this.createObjects();
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
     * * Creates objects every X pixels, based on game difficulty.
     *
     * @return void
     */
    private createObjects(): void {
        const x = this.sys.canvas.width;
        const y = 0;

        // createObstacles
        if (GameEngineSingleton.points > this.nextObstaclePoint && GameEngineSingleton.points < GameEngineSingleton.world.pointsToEndLevel) {
            const worldObjectNumber = Math.floor(Math.random() * GameEngineSingleton.world.objects.length);
            const worldObject = GameEngineSingleton.world.objects[worldObjectNumber];
            createObjects(worldObject, this, x + worldObject.spritePositionX, y, this.obstacleGroup);
            this.nextObstaclePoint += GameEngineSingleton.world.pixelForNextObstacle;
        }

        // createSteps
        if (GameEngineSingleton.points > GameEngineSingleton.world.pointsTillSteps && !this.stepsExist) {
            // TODO - Implement the create steps function to create steps and 2nd level of ground.  Not yet hooked up.
            // createSteps(this, x, y, this.obstacleGroup, this.character);
            //this.floor.sprite.setPosition(this.floor.sprite.x, this.floor.sprite.y - 50);
            this.stepsExist = true;
        }
        // Draw the museum if the goal points has been reached
        if (GameEngineSingleton.points > GameEngineSingleton.world.pointsToEndLevel && !this.isEndReached) {
            const tmpObject = this.physics.add.image(x, y, END_KEY);
            tmpObject.setName(END_KEY);
            tmpObject.setScale(END_OBJECT_SCALE);
            this.obstacleGroup.add(tmpObject);
            this.isEndReached = true;
        }
        this.obstacleGroup.setVelocityX(-WORLD_OBJECTS_VELOCITY * GameEngineSingleton.difficult);
        this.physics.add.collider(this.floor.sprite, this.obstacleGroup);
    }

    /**
     * * Method in progress to create the objects and create the collisions
     *
     * @private
     */
    private objectsDetection(): void {
        if (this.obstacleGroup.getChildren().length > 0) {
            this.obstacleGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
                if (worldObject) {
                    const playerYBelow = this.character.sprite.y + this.character.sprite.height / HALF_DIVIDER;
                    const playerXStart = this.character.sprite.x - this.character.sprite.width / HALF_DIVIDER;
                    const playerXEnd = this.character.sprite.x + this.character.sprite.width / HALF_DIVIDER;
                    const worldObjectYAbove = worldObject.y - worldObject.height / HALF_DIVIDER;
                    const worldObjectXStart = worldObject.x - worldObject.width / HALF_DIVIDER;
                    const worldObjectXEnd = worldObject.x + worldObject.width / HALF_DIVIDER;
                    if (worldObject.name === END_KEY && worldObjectXEnd <= window.innerWidth) {
                        // If the end is displayed stop the movement
                        this.obstacleGroup.setVelocityX(0);
                        this.isEnd = true;
                    }
                    // console.log(`COLLISION ${worldObject.name}`, playerXEnd >= worldObjectXStart, playerXStart <= worldObjectXEnd, playerYBelow >= worldObjectYAbove);
                    // console.log('DAMAGE BOUNDS', playerXEnd, worldObjectXStart, playerXStart, worldObjectXEnd, playerYBelow, worldObjectYAbove);
                    if (playerXEnd >= worldObjectXStart && playerXStart <= worldObjectXEnd && playerYBelow >= worldObjectYAbove) {
                        if (worldObject.name === Objects.CHEESESTEAK) {
                            this.healUp(worldObject);
                        } else if (worldObject.name === END_KEY) {
                            // If the end is tuched send to winning screen
                            void this.endGame(GameEnum.WIN);
                        } else if (worldObject.name === Objects.GLOVES) {
                            //* If gloves is picked up destroy the asset
                            worldObject.destroy();
                            this.obstacleGroup.remove(worldObject);
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
        this.obstacleGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
            if (worldObject && worldObject.x + worldObject.width < 0 - worldObject.width) {
                worldObject.destroy();
                this.obstacleGroup.remove(worldObject);
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
        this.obstacleGroup.remove(worldObject);
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
        const personWidth = this.character.sprite.width;
        const xMin = personWidth / HALF_DIVIDER; // Left limit
        const xMax = window.innerWidth - personWidth / HALF_DIVIDER; // right limit
        this.character.sprite.x = Phaser.Math.Clamp(this.character.sprite.x, xMin, xMax);
    }

    /**
     * * Moves the backgrounds by X
     *
     * @return void
     */
    private moveInfiniteBackgrounds(): void {
        // While the end has not reached do the scrolling of level
        if (!this.isEnd) {
            // Move the ground to the left of the screen and once it is off of screen adds it next the current one
            this.cityBackground.sprite.tilePositionX += 0.5;
            this.bushes.sprite.tilePositionX += 1;
            this.floor.sprite.tilePositionX += 2;
            if (this.secondFloor) this.secondFloor.sprite.tilePositionX += 2;
        }
    }
}
