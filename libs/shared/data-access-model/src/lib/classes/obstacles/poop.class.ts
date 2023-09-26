import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { WorldObject } from './world-object.class';

export class Poop extends WorldObject {
    public name = Objects.POOP; // * Object name
    public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Poop Sprite to be used

    constructor(level: LevelsEnum) {
        console.log('poop.class.ts', 'constructor()');
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
