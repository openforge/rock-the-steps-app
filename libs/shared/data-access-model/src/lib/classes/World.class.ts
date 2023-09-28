/* eslint-disable no-magic-numbers */
import { Anvil, Apple, BigPoo, Bottle, CheeseSteak, ChineseFood, Cone, Flowers, Ghost, Gloves, Hurdle, LibertyBell, Pigeon, Tourist, Trashcan, Wind } from '../..';
import { DifficultyEnum, LevelsEnum } from '../enums/levels.enum';
import { Crater } from './obstacles/crater.class';
import { Stand } from './obstacles/stand.class';
import { Tomb } from './obstacles/tomb.class';
import { WorldObject } from './obstacles/world-object.class';

/**
 * * World class is the one in charge to build all the elements related to the world game objects, character, heals, etc.
 */
export class World {
    public objects: WorldObject[] = []; // * WorldObjects to be shown in the world
    public worldType: LevelsEnum = LevelsEnum.DAYTIME; // * Location where the world level will be located
    public pixelForNextObstacle = 0; // * Pixel to create next obstacle;
    public difficultyLevel: DifficultyEnum; // * Property to get difficulty enum used in functions
    public moveSpeedBackground = 0; // * To get the total speed of the background
    public moveSpeedBushes = 0; // * To get the total speed of the bushes
    public moveSpeedFloor = 0; // * To get the total speed of the floor
    public secondsToShowNextFloor = 0; // * To show 2nd and 3rd floor at x seconds quantity
    constructor() {}

    /**
     * * Depending on user selection, we are either going to construct different levels dynamically
     * * in the phaser scene
     *
     * @param worldType LevelsEnum
     * @param difficulty DifficultyEnum
     * @returns World
     */
    public static build(worldType: LevelsEnum, difficulty: DifficultyEnum): World {
        const tmp_world = new World();
        tmp_world.worldType = worldType;
        tmp_world.difficultyLevel = difficulty;
        try {
            switch (worldType) {
                case LevelsEnum.DAYTIME:
                    this.createDayLevel(tmp_world);
                    break;
                case LevelsEnum.SUNSET:
                    this.createSunsetLevel(tmp_world);
                    break;
                case LevelsEnum.NIGHT:
                    this.createNightLevel(tmp_world);
                    break;
                case LevelsEnum.RITTEN_HOUSE:
                    this.createRittenLevel(tmp_world);
                    break;
                case LevelsEnum.CHINA_TOWN:
                    this.createChinaLevel(tmp_world);
                    break;
                case LevelsEnum.KELLY_DRIVE:
                    this.createKellyLevel(tmp_world);
                    break;
            }
            this.setWorldDifficultObjects(tmp_world, difficulty);
            return tmp_world;
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * * Function to create and push objects and data for Day Level
     *
     * @param world as World
     */
    public static createDayLevel(world: World): void {
        // * It has apple, gloves, bell, bottle, trashcan, cheese steak, cone, tourist, pigeon, pigeon poop
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Apple(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new Bottle(world.worldType));
        world.objects.push(new Trashcan(world.worldType));
        world.objects.push(new Cone(world.worldType));
        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 12000;
    }

    /**
     * * Function to create and push objects and data for Sunset Level
     *
     * @param world as World
     */
    public static createSunsetLevel(world: World): void {
        // * It has gloves, cheese steak, trashcan, hurdle, anvil, bigpoo, tourist, bell, pigeon, pigeon poop
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Trashcan(world.worldType));
        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Hurdle(world.worldType));
        world.objects.push(new Anvil(world.worldType));
        world.objects.push(new BigPoo(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 13000;
    }

    /**
     * * Function to create and push objects and data for Night Level
     *
     * @param world as World
     */
    public static createNightLevel(world: World): void {
        // * It has gloves, cheese steak, ghost, hurdle,  anvil, tomb, bell, tourist, pigeon, pigeon poop
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Anvil(world.worldType));
        world.objects.push(new Hurdle(world.worldType));
        world.objects.push(new Tomb(world.worldType));
        world.objects.push(new Ghost(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 14000;
    }

    /**
     * * Function to create and push objects and data for China Level
     *
     * @param world as World
     */
    public static createChinaLevel(world: World): void {
        // * It has ken, gloves, bell, crater, chinese food, cheese steak, cone, tourist, pigeon, pigeon poop
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Crater(world.worldType));
        world.objects.push(new Apple(world.worldType));
        world.objects.push(new Anvil(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new ChineseFood(world.worldType));
        world.objects.push(new Cone(world.worldType));
        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 15000;
    }

    /**
     * * Function to create and push objects and data for Ritten Level
     *
     * @param world as World
     */
    public static createRittenLevel(world: World): void {
        // * It has apple, gloves, bell, bottle, trashcan, cheese steak, stand, tourist, pigeon, pigeon poop
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Apple(world.worldType));
        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Trashcan(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new Bottle(world.worldType));
        world.objects.push(new Stand(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 16000;
    }

    /**
     * * Function to create and push objects and data for Kelly Level
     *
     * @param world as World
     */
    public static createKellyLevel(world: World): void {
        world.objects.push(new Gloves(world.worldType));
        world.objects.push(new CheeseSteak(world.worldType));

        world.objects.push(new Apple(world.worldType));
        world.objects.push(new Wind(world.worldType));
        world.objects.push(new Flowers(world.worldType));
        world.objects.push(new Tourist(world.worldType));
        world.objects.push(new Cone(world.worldType));
        world.objects.push(new LibertyBell(world.worldType));
        world.objects.push(new Pigeon(world.worldType));
        world.secondsToShowNextFloor = 17000;
    }

    /**
     * * The lower the value, the more frequently objects appear.  This increases the difficulty
     *
     * @param world as World
     * @param difficult as DifficultyEnum
     */
    private static setWorldDifficultObjects(world: World, difficult: DifficultyEnum): void {
        switch (difficult) {
            case DifficultyEnum.EASY: {
                world.pixelForNextObstacle = 100;
                world.moveSpeedBackground = 0.3;
                world.moveSpeedBushes = 0.8;
                world.moveSpeedFloor = 1.8;
                break;
            }
            case DifficultyEnum.MEDIUM: {
                world.pixelForNextObstacle = 70;
                world.moveSpeedBackground = 0.6;
                world.moveSpeedBushes = 1.1;
                world.moveSpeedFloor = 2.1;
                break;
            }
            case DifficultyEnum.HARD: {
                world.pixelForNextObstacle = 50;
                world.moveSpeedBackground = 0.8;
                world.moveSpeedBushes = 1.3;
                world.moveSpeedFloor = 2.3;
                break;
            }
            default: {
                world.pixelForNextObstacle = 130;
                world.moveSpeedBackground = 0.3;
                world.moveSpeedBushes = 0.8;
                world.moveSpeedFloor = 1.8;
                break;
            }
        }
    }
}
