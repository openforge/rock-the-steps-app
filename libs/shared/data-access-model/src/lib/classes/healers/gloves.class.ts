import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { WorldObject } from '../obstacles/world-object.class';

export class Gloves extends WorldObject {
    public name = Objects.GLOVES; // * Object name

    constructor(level: LevelsEnum) {
        console.log('gloves.class.ts', 'constructor()');
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building healer ${this.name}`, error);
        }
    }
}
