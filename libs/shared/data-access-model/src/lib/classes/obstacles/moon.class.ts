import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { WorldObject } from './world-object.class';

export class Moon extends WorldObject {
    public name = Objects.MOON; // * Object name

    constructor(level: LevelsEnum) {
        console.log('moon.class.ts', 'constructor()');
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
