import { Anvil, Apple, BigPoo, Bottle, CheeseSteak, ChineseFood, Cone, DifficultEnum, Flowers, Ghost, Gloves, Hurdle, LevelsEnum, LibertyBell, Tourist, Trashcan, Wind } from '../..';
import { Crater } from './obstacles/crater.class';
import { Stand } from './obstacles/stand.class';
import { Tomb } from './obstacles/tomb.class';
import { WorldObject } from './obstacles/world-object.class';

/**
 * World class is the one in charge to build all the elements related to the world game worldObjects, character, heals, etc.
 */
export class World {
    public worldObjects: WorldObject[] = []; // * WorldObjects to be shown in the world
    public worldType: LevelsEnum = LevelsEnum.DAYTIME; // * Location where the world level will be located
    public pointsToEndLevel = 0; // * Points to end level
    public pixelForNextObstacle = 0; // * Pixel to create next obstacle;
    public difficultyLevel: DifficultEnum;
    constructor() {
        World.createDayLevel(this);
    }

    /**
     * * Depending on user selection, we are either going to construct different levels dynamically
     * * in the phaser scene
     *
     * @param worldType LevelsEnum
     * @param difficulty DifficultEnum
     * @returns World
     */
    public static build(worldType: LevelsEnum, difficulty: DifficultEnum): World {
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
    public static createDayLevel(world: World): void {
        // It has apple, gloves, bell, bottle, trashcan, cheese steak, cone, tourist, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Apple(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.worldObjects.push(new Bottle(world.worldType));
        world.worldObjects.push(new Trashcan(world.worldType));
        world.worldObjects.push(new Cone(world.worldType));
        world.worldObjects.push(new Tourist(world.worldType));
        world.pointsToEndLevel = 999;
    }
    public static createSunsetLevel(world: World): void {
        // It has gloves, cheese steak, trashcan, hurdle, anvil, bigpoo, tourist, bell, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Trashcan(world.worldType));
        world.worldObjects.push(new Tourist(world.worldType));
        world.worldObjects.push(new Hurdle(world.worldType));
        world.worldObjects.push(new Anvil(world.worldType));
        world.worldObjects.push(new BigPoo(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.pointsToEndLevel = 1999;
    }
    public static createNightLevel(world: World): void {
        // It has gloves, cheese steak, ghost, hurdle,  anvil, tomb, bell, tourist, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Tourist(world.worldType));
        world.worldObjects.push(new Anvil(world.worldType));
        world.worldObjects.push(new Hurdle(world.worldType));
        world.worldObjects.push(new Tomb(world.worldType));
        world.worldObjects.push(new Ghost(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.pointsToEndLevel = 2999;
    }
    public static createChinaLevel(world: World): void {
        // It has ken, gloves, bell, crater, chinese food, cheese steak, cone, tourist, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Crater(world.worldType));
        world.worldObjects.push(new Apple(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.worldObjects.push(new ChineseFood(world.worldType));
        world.worldObjects.push(new Cone(world.worldType));
        world.worldObjects.push(new Tourist(world.worldType));
        world.pointsToEndLevel = 3499;
    }
    public static createRittenLevel(world: World): void {
        // It has apple, gloves, bell, bottle, trashcan, cheese steak, stand, tourist, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Apple(world.worldType));
        world.worldObjects.push(new Tourist(world.worldType));
        world.worldObjects.push(new Trashcan(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.worldObjects.push(new Bottle(world.worldType));
        world.worldObjects.push(new Stand(world.worldType));
        world.pointsToEndLevel = 3899;
    }
    public static createKellyLevel(world: World): void {
        // It has apple, gloves, bell, wind, flowers, cheese steak, cone, tourist, pigeon, pigeon poop
        world.worldObjects.push(new Gloves(world.worldType));
        world.worldObjects.push(new CheeseSteak(world.worldType));

        world.worldObjects.push(new Apple(world.worldType));
        world.worldObjects.push(new Wind(world.worldType));
        world.worldObjects.push(new Flowers(world.worldType));
        world.worldObjects.push(new Tourist(world.worldType));
        world.worldObjects.push(new Cone(world.worldType));
        world.worldObjects.push(new LibertyBell(world.worldType));
        world.pointsToEndLevel = 4499;
    }

    /**
     * * Function to set the obstacles difficulty for the world
     *
     * @param world as World
     * @param difficult as DifficultEnum
     */
    private static setWorldDifficultObjects(world: World, difficult: DifficultEnum): void {
        switch (difficult) {
            case DifficultEnum.EASY: {
                world.pixelForNextObstacle = 130;
                break;
            }
            case DifficultEnum.MEDIUM: {
                world.pixelForNextObstacle = 100;
                break;
            }
            case DifficultEnum.HARD: {
                world.pixelForNextObstacle = 80;
                break;
            }
            default: {
                world.pixelForNextObstacle = 130;
                break;
            }
        }
    }
}
