import { LevelsEnum } from '../../enums/levels.enum';
import { WorldObject } from '../obstacles/world-object.class';

export class ChesseSteak extends WorldObject {
    name = 'cheesesteak';
    constructor(level: LevelsEnum) {
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
