/* eslint-disable no-magic-numbers */
import {
    Bushes,
    BUSHES_KEY,
    Character,
    CHARACTER_SPRITE_KEY,
    CITY_KEY,
    CityBackground,
    CONTROLS_KEY,
    DAMAGE_MAX_VALUE,
    DAMAGE_MIN_VALUE,
    DAMAGE_TIMER,
    END_KEY,
    END_OBJECT_SCALE,
    FIRST_ACHIEVEMENT_ID,
    Floor,
    FLOOR_KEY,
    FLY_GROUNDED_PIGEONS_OFFSET,
    GameEnum,
    GameServicesActions,
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
    Pigeon,
    Poop,
    SKY_KEY,
    STARTER_PIXEL_FLAG,
    STEPS_KEY,
    UPPER_FLOORS_VELOCITY,
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
import { createPigeonObjectSprite, createSteps } from '../utilities/object-creation-helper';

export class WorldScene extends Phaser.Scene {
    private gameServicesActions: GameServicesActions = new GameServicesActions();
    private obstacleGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private stepsGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the steps has collisions with floor but no with player and no damage
    private floorsGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the floors has collisions with floor, steps and with player but no damage
    private obstaclePigeonGroup: Pigeon[] = []; // * Array of sprites for the pigeon obstacles
    private obstaclePoopGroup: Poop[] = []; // * Array of sprites for the pigeon obstacles
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
    public firstFloor: Floor; // * Used to set the image sprite and then using it into the infinite movement function
    public secondFloor: Floor;
    public thirdFloor: Floor;

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
        this.scale.orientation = Phaser.Scale.Orientation.LANDSCAPE; // * We need to set the orientation to landscape for the scene
        this.scale.lockOrientation('landscape');
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
        this.firstFloor = new Floor(this, 0, 0, 1);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacleGroup = this.physics.add.group();
        this.stepsGroup = this.physics.add.group();
        this.floorsGroup = this.physics.add.group();
        this.spaceBarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.damageValue = 0;
        this.character = new Character(this, this.firstFloor.sprite);
        this.healthbar = this.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.pointsText = this.add.text(INITIAL_POINTS_X, INITIAL_POINTS_Y, '0', { fontSize: '3vh', color: 'black' });
    }

    /**
     * * Method to used by PHASER to execute every frame refresh
     *
     * @return void
     */
    update() {
        // console.log('Char position', this.character.sprite.y)
        this.calculatePoints();
        this.flyGroundedPigeons();
        this.moveInfiniteBackgrounds();
        this.character.evaluateMovement(this.cursors);
        this.character.moveCharacterAutomatically();
        this.avoidOutOfBounds();
        this.createObjects();
        this.endDetection();
        this.cleanUpObjects();
    }

    /**
     * Method used to fly pigeons grounded
     *
     * @private
     */
    private flyGroundedPigeons(): void {
        this.obstaclePigeonGroup.forEach(pigeon => {
            if (pigeon.sprite.x < window.innerWidth * FLY_GROUNDED_PIGEONS_OFFSET) {
                pigeon.flyFromTheGround(this, this.obstaclePoopGroup, this.character, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
            }
        });
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
            if (worldObject.name === Objects.PIGEON && worldObject instanceof Pigeon) {
                const pigeonSprite = createPigeonObjectSprite(this, worldObject, x + worldObject.spritePositionX, y);
                worldObject.sprite = pigeonSprite;
                worldObject.fly();
                worldObject.dropPoop(this, this.obstaclePoopGroup, this.character, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
                this.obstaclePigeonGroup.push(worldObject);
                this.physics.add.collider(this.firstFloor.sprite, pigeonSprite);
                this.physics.add.collider(this.character.sprite, pigeonSprite, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
            } else {
                // createObjects(worldObject, this, x + worldObject.spritePositionX, y, this.obstacleGroup);
            }
            this.nextObstaclePoint += GameEngineSingleton.world.pixelForNextObstacle;
        }

        // createSteps
        if (GameEngineSingleton.points > GameEngineSingleton.world.pointsTillSteps && !this.stepsExist) {
            // TODO - Implement the create steps function to create steps and 2nd level of ground.  Not yet hooked up.
            const steps = createSteps(this, x, y, this.firstFloor);
            this.stepsGroup.add(steps);
            //const floorTmp = createFloor(this, x + steps.width * 2, y, this.floor, this.character);
            this.secondFloor = new Floor(this, window.innerWidth * 0.1, 0, 2);
            console.log('Floor created', this.secondFloor);

            //this.floorsGroup.add(floorTmp);
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
        this.physics.add.collider(this.firstFloor.sprite, this.obstacleGroup);
        this.physics.add.collider(this.character.sprite, this.obstacleGroup);
        //* Group of sprites for the steps has collisions with floor but no with player and no damage
        this.physics.add.collider(this.firstFloor.sprite, this.stepsGroup);
        this.stepsGroup.setVelocityX(-UPPER_FLOORS_VELOCITY * GameEngineSingleton.difficult);
        // * Group of sprites for the obstacles has collisions with floor, steps and with player but no damage
        this.physics.add.collider(this.stepsGroup, this.floorsGroup);
        this.physics.add.collider(this.character.sprite, this.floorsGroup);
        if (this.secondFloor) this.physics.add.collider(this.firstFloor.sprite, this.secondFloor.sprite);
        this.floorsGroup.setVelocityX(-UPPER_FLOORS_VELOCITY * GameEngineSingleton.difficult);
    }

    /**
     * Method used to listen for collisions with obstacles
     *
     * @param player
     * @param obstacle
     * @private
     */
    private obstacleHandler(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        console.log(`Colliding ${player.name} with ${obstacle.name}`);
        if (obstacle.name === Objects.CHEESESTEAK && this.damageValue > DAMAGE_MIN_VALUE && this.damageValue) {
            this.healUp(obstacle);
        } else if (obstacle.name === END_KEY) {
            // If the end is touched send to winning screen
            void this.endGame(GameEnum.WIN);
        } else if (obstacle.name === Objects.GLOVES) {
            //* If gloves is picked up destroy the asset
            obstacle.destroy();
            this.obstacleGroup.remove(obstacle);
            this.character.makeInvulnerable(this);
        } else if (!this.character.isDamaged && !this.character.isInvulnerable) {
            obstacle.destroy();
            this.receiveDamage();
        }
    }

    /**
     * * Method used to detect end of level
     *
     * @private
     */
    private endDetection(): void {
        if (this.obstacleGroup.getChildren().length > 0) {
            this.obstacleGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
                if (worldObject) {
                    const worldObjectXEnd = worldObject.x + worldObject.width / HALF_DIVIDER;
                    if (worldObject.name === END_KEY && worldObjectXEnd <= window.innerWidth) {
                        // If the end is displayed stop the movement
                        this.obstacleGroup.setVelocityX(0);
                        this.isEnd = true;
                    }
                }
            });
        }
        if (this.stepsGroup.getChildren().length > 0) {
            this.stepsGroup.children.iterate((step: Phaser.GameObjects.Image) => {
                const playerYBelow = this.character.sprite.y + this.character.sprite.height / HALF_DIVIDER;
                const stepYBelow = step.y + step.height / HALF_DIVIDER;
                const stepXEnd = step.x + step.width / HALF_DIVIDER;
                const playerXStart = this.character.sprite.x - this.character.sprite.width / HALF_DIVIDER;
                const stepYAbove = step.y - step.height / HALF_DIVIDER;
                console.log('Y values player/step', playerYBelow, stepYBelow, stepXEnd, playerXStart);
                // If player Y bottom is same or less that stairs and X is bigger than steps X then go UP!
                if (step && playerYBelow >= stepYAbove && this.character.sprite.x > step.x) {
                    // Calculated values that will be possible used for the steps
                    // const stepXStart = step.x - step.width / HALF_DIVIDER;
                    // const playerXEnd = this.character.sprite.x + this.character.sprite.width / HALF_DIVIDER;
                    console.log('GOING UP');
                    this.character.sprite.setVelocityY(-150);
                }
                // If player Y bottom is greater than stairs top and X start of player is greater than X end stairs THEN stop going up!
                if (step && playerYBelow > stepYAbove && stepXEnd < playerXStart) {
                    console.log('STOP');
                    this.character.sprite.setVelocityY(0);
                }
                if (step.name === STEPS_KEY && stepXEnd <= 0) {
                    // If the end is displayed stop the movement
                    this.stepsGroup.setVelocityX(0);
                    step.destroy();
                    this.isEnd = true;
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
            await this.gameServicesActions.submitScore(GameEngineSingleton.points);
            if (GameEngineSingleton.world.worldType === LevelsEnum.DAYTIME) {
                await this.gameServicesActions.unlockAchievement(FIRST_ACHIEVEMENT_ID);
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
        // console.log('Poops ', this.obstaclePigeonGroup);

        this.obstaclePigeonGroup.map((worldObject: Pigeon, index) => {
            if (worldObject && worldObject.sprite.x + worldObject.sprite.width < 0 - worldObject.sprite.width) {
                worldObject.sprite.destroy();
            } else if (worldObject && worldObject.sprite.y + worldObject.sprite.height > window.innerHeight + worldObject.sprite.height) {
                worldObject.sprite.destroy();
                this.obstaclePigeonGroup.splice(index, 1);
            }
        });
    }

    /**
     * Method used to heal up player
     *
     * @param worldObject cheesesteak to be destroyed after used
     */
    private healUp(worldObject: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
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
            this.firstFloor.sprite.tilePositionX += 2;
            if (this.secondFloor) this.secondFloor.sprite.tilePositionX += 2;
        }
    }
}
