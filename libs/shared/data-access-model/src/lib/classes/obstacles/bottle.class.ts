import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { WorldObject } from './world-object.class';

export class Bottle extends WorldObject {
    public name = Objects.BOTTLE; // * Object name

    constructor(level: LevelsEnum) {
        console.log('bottle.class.ts', 'constructor()');
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
