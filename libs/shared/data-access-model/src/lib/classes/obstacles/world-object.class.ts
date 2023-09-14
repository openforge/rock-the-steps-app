import { LevelsEnum } from '@openforge/shared/data-access-model';

import { INITIAL_X_REGULAR_ASSET_START } from '../../constants/game-units.constants';
import { Objects } from '../../enums/objects.enum';
import { PrimordialObject } from '../../models/primordial-object.interface';

/**
 * Base class to be extended by implementations
 */
export abstract class WorldObject implements PrimordialObject {
    abstract name: Objects; // * Object name
    public spritePositionX = INITIAL_X_REGULAR_ASSET_START; // * Sprite position value for X for the object
    public spritePositionY = 0; // * Sprite position value for Y for the object
    public level: LevelsEnum; // * Level value for the object
}
