import { LevelsEnum } from '../../enums/levels.enum';
import { WorldObject } from './world-object.class';

export class Stand extends WorldObject {
    name = 'stand';
    constructor(level: LevelsEnum) {
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
