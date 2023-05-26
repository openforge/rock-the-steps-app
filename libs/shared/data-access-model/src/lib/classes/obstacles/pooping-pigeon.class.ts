import { LevelsEnum } from '../../enums/levels.enum';
import { WorldObject } from './world-object.class';
import {Objects} from "../../enums/objects.enum";

export class PoopingPigeon extends WorldObject {
    name = Objects.POOPINGPIGEON;
    constructor(level: LevelsEnum) {
        super();
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
