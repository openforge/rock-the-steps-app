import { Apple, Bottle, ChesseSteak, ChineseFood, Cone, Gloves, LibertyBell, Pigeon, PoopingPigeon, Tourist, Trashcan } from '../..';
import { LevelsEnum } from '../enums/levels.enum';
import { Healer } from './healers/healer.class';
import { Obstacle } from './obstacles/obstacle.class';

/**
 * World class is the one in charge to build all the elements related to the world game obstacles, character, heals, etc.
 */
export class World {
    public obstacles: Obstacle[] = []; // * Obtacles to be shown in the world
    public healers: Healer[] = []; // * Obtacles to be shown in the world
    public worldType: LevelsEnum; // * Location where the world level will be located
    constructor() {}

    public static build(worldType: LevelsEnum): World {
        const tmp_world = new World();
        tmp_world.worldType = worldType;
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
            return tmp_world;
        } catch (e) {
            console.error(e);
        }
    }
    public static createDayLevel(world: World): void {
        // It has apple, gloves, bell, bottle, trashcan, cheese steak, cone, tourist, pigeon, pigeon poop
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));

        world.obstacles.push(new Apple(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
        world.obstacles.push(new Bottle(world.worldType));
        world.obstacles.push(new Trashcan(world.worldType));
        world.obstacles.push(new Cone(world.worldType));
        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
    }
    public static createSunsetLevel(world: World): void {
        // It has trashcan, hurdle, gloves, anvil, poop, cheese steak, tourist, pigeon, pigeon poop, bell
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));

        // world.obstacles.push(new Apple(world.worldType)); // HURDLE
        // world.obstacles.push(new Apple(world.worldType)); // ANVIL
        // world.obstacles.push(new Apple(world.worldType)); // POOP
        world.obstacles.push(new Trashcan(world.worldType));
        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
    }
    public static createNightLevel(world: World): void {
        // It has ghost, hurdle, gloves, anvil, tomb, cheese steak, tourist, pigeon, pigeon poop, bell
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));

        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
    }
    public static createChinaLevel(world: World): void {
        // It has ken, gloves, bell, crater, chinese food, cheese steak, cone, tourist, pigeon, pigeon poop
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));
        // world.obstacles.push(new Apple(world.worldType)); // KEN
        world.obstacles.push(new Apple(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
        world.obstacles.push(new ChineseFood(world.worldType));
        world.obstacles.push(new Cone(world.worldType));
        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
    }
    public static createRittenLevel(world: World): void {
        // It has apple, gloves, bell, bottle, trashcan, cheese steak, stand, tourist, pigeon, pigeon poop
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));

        world.obstacles.push(new Apple(world.worldType));
        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
    }
    public static createKellyLevel(world: World): void {
        // It has apple, gloves, bell, wind, flowers, cheese steak, cone, tourist, pigeon, pigeon poop
        world.healers.push(new Gloves(world.worldType));
        world.healers.push(new ChesseSteak(world.worldType));

        world.obstacles.push(new Apple(world.worldType));
        world.obstacles.push(new Tourist(world.worldType));
        world.obstacles.push(new Pigeon(world.worldType));
        world.obstacles.push(new PoopingPigeon(world.worldType));
        world.obstacles.push(new LibertyBell(world.worldType));
    }
}
