import { LevelsEnum } from '../../enums/levels.enum';
import { PrimordialObject } from '../PrimordialObject.class';

/**
 * Base class to be extended by implementations
 */
export abstract class Healer implements PrimordialObject {
    abstract name: string;
    spritePositionX = 0;
    spritePositionY = 0;
    level: LevelsEnum;

    abstract getSpritePositions(level: LevelsEnum): [number, number];
}
