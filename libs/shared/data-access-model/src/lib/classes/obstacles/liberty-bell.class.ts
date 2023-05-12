import { LevelsEnum } from '../../enums/levels.enum';
import { Obstacle } from './obstacle.class';

export class LibertyBell extends Obstacle {
    name = 'liberty-bell';
    constructor(level: LevelsEnum) {
        super();
        try {
            this.level = level;
            [this.spritePositionX, this.spritePositionY] = this.getSpritePositions(level);
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }

    /**
     * Method used to retrieve their coords in sprite file
     *
     * @param level Asset to be analyzed
     */
    public getSpritePositions(level: LevelsEnum): [number, number] {
        switch (level) {
            case LevelsEnum.DAYTIME:
                // eslint-disable-next-line no-magic-numbers
                return [32, 32];
                break;
        }
    }
}
