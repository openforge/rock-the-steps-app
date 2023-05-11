import { LevelsEnum } from '@openforge/shared/data-access-model';

/**
 * Class in charge to name and give properties to any element below the world
 */
export interface PrimordialObject {
    spritePositionX: number; // * Where the asset is located in the level sprite position X
    spritePositionY: number; // * Where the asset is located in the level sprite position Y
    name: string; // * Name given to each object of the world
    level: LevelsEnum; // * Level where this element can be found

    /**
     * Method used to retrieve their positions X and Y in the sprite level
     *
     * @param level to distinguish the resource to look at
     */
    getSpritePositions(LevelsEnum): [number, number];
}
