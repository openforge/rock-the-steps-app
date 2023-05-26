import { LevelsEnum } from '@openforge/shared/data-access-model';

import { INITIAL_X_REGULAR_ASSET_START } from '../../constants/game-units.constants';
import { PrimordialObject } from '../PrimordialObject.class';

/**
 * Base class to be extended by implementations
 */
export abstract class WorldObject implements PrimordialObject {
    abstract name: string;
    spritePositionX = INITIAL_X_REGULAR_ASSET_START;
    spritePositionY = 0;
    level: LevelsEnum;
}
