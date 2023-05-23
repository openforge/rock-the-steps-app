import { LevelsEnum } from '../../enums/levels.enum';
import { WorldObject } from './world-object.class';

export class Ghost extends WorldObject {
    name = 'ghost';
    constructor(level: LevelsEnum) {
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}