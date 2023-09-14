import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { WorldObject } from '../obstacles/world-object.class';

export class CheeseSteak extends WorldObject {
    public name = Objects.CHEESESTEAK; // * Object Name

    constructor(level: LevelsEnum) {
        console.log('cheese-steak.class.ts', 'constructor()');
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building healer ${this.name}`, error);
        }
    }
}
