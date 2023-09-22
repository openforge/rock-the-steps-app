/* eslint-disable no-magic-numbers */
import {
    BACKGROUND_AUDIO_KEY,
    Bushes,
    BUSHES_KEY,
    Character,
    CHARACTER_SPRITE_KEY,
    CITY_KEY,
    CityBackground,
    CONTROLS_KEY,
    DAMAGE_MAX_VALUE,
    DAMAGE_MIN_VALUE,
    DifficultyEnum,
    END_KEY,
    FIRST_ACHIEVEMENT_ID,
    Floor,
    FLOOR_KEY,
    FLY_GROUNDED_PIGEONS_OFFSET,
    GameEnum,
    GameServicesActions,
    HALF_DIVIDER,
    HEALTHBAR_KEY,
    INITIAL_POINTS_X,
    INITIAL_POINTS_Y,
    JUMP_AUDIO_KEY,
    JUMP_KEY,
    LevelsEnum,
    OBJECTS_SPRITE_KEY,
    PAUSE_BUTTON,
    Pigeon,
    Poop,
    SKY_KEY,
    STARTER_PIXEL_FLAG,
    STEPS_KEY,
    WORLD_OBJECTS_VELOCITY,
    WORLD_SCENE,
} from '@openforge/shared/data-access-model';
import { CONFIG, PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import * as Phaser from 'phaser';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { Objects } from '../../../../data-access-model/src/lib/enums/objects.enum';
import { createAnimationsCharacter } from '../utilities/character-animation';
import { createButtons } from '../utilities/hud-helper';
import * as ObstacleHelper from '../utilities/object-creation-helper';
import * as StepsHelper from '../utilities/steps-helper';

export class WorldScene extends Phaser.Scene {
    private gameServicesActions: GameServicesActions = new GameServicesActions();
    private obstacleGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the obstacles
    private stepsGroup: Phaser.Physics.Arcade.Group; // * Group of sprites for the steps has collisions with floor but no with player and no damage
    private obstaclePigeonGroup: Pigeon[] = []; // * Array of sprites for the pigeon obstacles
    private obstaclePoopGroup: Poop[] = []; // * Array of sprites for the pigeon obstacles
    private character: Character; // this is the class associated with the player
    private nextObstaclePoint = STARTER_PIXEL_FLAG; // * Pixels flag to know if next worldObject needs to be drawn
    private pointsText: Phaser.GameObjects.Text; // * Text to display the points
    private spaceBarKey: Phaser.Input.Keyboard.Key; // Spacebar key to move the player in pc
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys; // Cursos keys to move the player in pc

    private isEnd: boolean = false; // Boolean to distinguish if the end has been shown
    private isEndReached: boolean = false; // Boolean to distinguish if the end has been reached

    public cityBackground: CityBackground; // * Used to set the image sprite and then using it into the infinite movement function
    public bushes: Bushes; // * Used to set the image sprite and then using it into the infinite movement function
    public firstFloor: Floor; // * Used to set the image sprite and then using it into the infinite movement function
    public secondFloor: Floor; // * Used to set the image sprite and then using it into the infinite movement function
    public thirdFloor: Floor; // * Used to set the image sprite and then using it into the infinite movement function
    public floorLevel: number = 1; // * Var used to detect the actual flow level

    constructor() {
        console.log('world.scene.ts', 'constructor()');
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

            // * Loading audio files
            this.load.audio(BACKGROUND_AUDIO_KEY, 'assets/audios/background/background-music-for-mobile-casual-video-game-short-8-bit-music-164703.mp3');
            this.load.audio(JUMP_AUDIO_KEY, 'assets/audios/jump/cartoon-jump-6462.mp3');
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
        GameEngineSingleton.audioService.playBackground(this);
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
        this.firstFloor = new Floor(this, 0, 0, 1, this.character, this.obstacleGroup);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.obstacleGroup = this.physics.add.group();
        this.stepsGroup = this.physics.add.group();
        this.spaceBarKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.character = new Character(this, this.firstFloor.sprite);
        this.physics.add.existing(this.firstFloor.sprite, true);
        this.pointsText = this.add.text(INITIAL_POINTS_X, INITIAL_POINTS_Y, '0', { fontSize: '3vh', color: 'black' });
    }
    /**
     * * Method used to listen for collisions with obstacles
     *
     * @param player
     * @param obstacle
     * @private
     */
    private obstacleHandler(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        console.log(`Colliding ${player.name} with ${obstacle.name}`);
        if (obstacle.name === Objects.CHEESESTEAK && this.character.damageValue > DAMAGE_MIN_VALUE && this.character.damageValue) {
            this.character.healUp(obstacle, this.obstacleGroup);
        } else if (obstacle.name === Objects.CHEESESTEAK && this.character.damageValue === DAMAGE_MIN_VALUE) {
            // * If object is a cheesesteak and the player is at full heath, do nothing
            this.obstacleGroup.remove(obstacle);
        } else if (obstacle.name === END_KEY) {
            //* By each extra health slice give 100 extra points
            GameEngineSingleton.points += (DAMAGE_MAX_VALUE - this.character.damageValue) * 100;
            // * If the end is touched send to winning screen
            void this.endGame(GameEnum.WIN);
        } else if (obstacle.name === Objects.GLOVES) {
            //* If gloves is picked up destroy the asset
            obstacle.destroy();
            this.obstacleGroup.remove(obstacle);
            this.character.makeInvulnerable(this);
        } else if (this.character.isInvulnerable) {
            this.obstacleGroup.remove(obstacle);
        } else if (obstacle.name !== Objects.CHEESESTEAK && !this.character.isDamaged && !this.character.isInvulnerable) {
            obstacle.destroy();
            this.character.receiveDamage(this, this.endGame);
        }
    }
    /**
     * * Method to used by PHASER to execute every frame refresh
     *
     * @return void
     */
    update() {
        this.calculatePoints();
        this.flyGroundedPigeons();
        this.moveInfiniteBackgrounds();
        this.character.evaluateMovement(this.cursors);
        this.character.moveCharacterAutomatically(this.cursors);
        this.character.avoidOutOfBounds();
        ObstacleHelper.drawEndMuseum(this, this.isEndReached, this.obstacleGroup);
        ObstacleHelper.cleanUpObjects(this.obstacleGroup, this.obstaclePigeonGroup);
        StepsHelper.stepsDetection(this.stepsGroup, this.character);
        StepsHelper.floorRotation(this.stepsGroup, this.secondFloor, this.thirdFloor);
        this.createObjects();
        this.endDetection();
        this.floorCreationFlow();
    }

    /**
     * Metod to generate new floor if it applies
     *
     * @private
     */
    private floorCreationFlow(): void {
        if (GameEngineSingleton.points === GameEngineSingleton.world.pointsToShowSecondFloor || GameEngineSingleton.points === GameEngineSingleton.world.pointsToShowThirdFloor) {
            this.createNewFloorIfApplies();
        }
    }

    /**
     * * Method used to fly pigeons grounded
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
     * * Method used to calculate the points and update the text in the game
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

        // * createObstacles
        if (GameEngineSingleton.points > this.nextObstaclePoint && GameEngineSingleton.points < GameEngineSingleton.world.pointsToEndLevel) {
            const worldObjectNumber = Math.floor(Math.random() * GameEngineSingleton.world.objects.length);
            const worldObject = GameEngineSingleton.world.objects[worldObjectNumber];
            if (worldObject.name === Objects.PIGEON && worldObject instanceof Pigeon) {
                const pigeonSprite = ObstacleHelper.createPigeonObjectSprite(this, worldObject, x + worldObject.spritePositionX, y);
                worldObject.sprite = pigeonSprite;
                worldObject.fly();
                worldObject.dropPoop(this, this.obstaclePoopGroup, this.character, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
                this.obstaclePigeonGroup.push(worldObject);
                this.physics.add.collider(this.firstFloor.sprite, pigeonSprite);
                this.physics.add.collider(this.character.sprite, pigeonSprite, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
            } else {
                ObstacleHelper.createObjects(worldObject, this, x + worldObject.spritePositionX, y, this.obstacleGroup);
            }
            this.nextObstaclePoint += GameEngineSingleton.world.pixelForNextObstacle;
        }
        this.obstacleGroup.setVelocityX(-WORLD_OBJECTS_VELOCITY * GameEngineSingleton.difficult);

        this.physics.add.collider(this.firstFloor.sprite, this.obstacleGroup);
        this.physics.add.collider(this.character.sprite, this.obstacleGroup, this.obstacleHandler.bind(this) as ArcadePhysicsCallback);
        //* Group of sprites for the steps has collisions with floor but no with player and no damage\
    }

    /**
     * Method used to create dynamically the sprites for the steps
     */
    public createNewFloorIfApplies(): void {
        if (GameEngineSingleton.difficult === DifficultyEnum.EASY) {
            this.floorLevel = 0;
            return;
        } else if (GameEngineSingleton.difficult === DifficultyEnum.MEDIUM) {
            this.setFloorObject(2);
        } else if (GameEngineSingleton.difficult === DifficultyEnum.HARD) {
            this.setFloorObject(3);
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
    }

    /**
     * * Method used to send the user back to the main screen
     *
     * @param result Result of the game reached WIN/LOSE
     * @return void
     */
    private async endGame(result: GameEnum): Promise<void> {
        this.scene.stop(); // Delete modal scene
        PhaserSingletonService.activeGame.destroy(true);
        PhaserSingletonService.activeGame = undefined;
        GameEngineSingleton.gameEventType.next(result);
        if (result === GameEnum.WIN) {
            await this.gameServicesActions.submitScore(GameEngineSingleton.points);
            if (GameEngineSingleton.world.worldType === LevelsEnum.DAYTIME) {
                await this.gameServicesActions.unlockAchievement(FIRST_ACHIEVEMENT_ID);
            }
        }
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
            this.cityBackground.sprite.tilePositionX += GameEngineSingleton.world.moveSpeedBackground;
            this.bushes.sprite.tilePositionX += GameEngineSingleton.world.moveSpeedBushes;
            this.firstFloor.sprite.tilePositionX += GameEngineSingleton.world.moveSpeedFloor;
            if (this.secondFloor) this.secondFloor.sprite.tilePositionX += GameEngineSingleton.world.moveSpeedFloor;
            if (this.thirdFloor) this.thirdFloor.sprite.tilePositionX += GameEngineSingleton.world.moveSpeedFloor;
        }
    }

    /**
     * Method used to add new floor depending on which is the next one
     *
     * @param limitLevel
     * @private
     */
    private setFloorObject(limitLevel: number): void {
        const x = this.sys.canvas.width;
        if (GameEngineSingleton.points > GameEngineSingleton.world.pointsTillSteps * this.floorLevel && this.floorLevel < limitLevel) {
            this.floorLevel++;
            const steps = StepsHelper.createSteps(this, x, CONFIG.DEFAULT_HEIGHT - CONFIG.DEFAULT_HEIGHT * (0.1 * this.floorLevel + 1));
            this.stepsGroup.add(steps);
            if (this.floorLevel === 2) {
                const newFloor2 = new Floor(this, 0, 0, this.floorLevel + 1, this.character, this.obstacleGroup, this.firstFloor);
                this.secondFloor = newFloor2;
                this.physics.add.collider(this.firstFloor.sprite, steps);
                newFloor2.sprite.setOrigin(-1);
            }
            if (this.floorLevel === 3) {
                const newFloor3 = new Floor(this, 0, 0, this.floorLevel + 1, this.character, this.obstacleGroup, this.firstFloor, this.secondFloor);
                this.thirdFloor = newFloor3;
                this.physics.add.collider(this.secondFloor.sprite, steps);
                newFloor3.sprite.setOrigin(-1);
            }
        }
    }
}
