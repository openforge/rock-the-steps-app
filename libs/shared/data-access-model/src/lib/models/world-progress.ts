import { LevelsEnum } from '../enums';

export interface WorldProgress {
    levelEnum: LevelsEnum;
    unlocked: boolean;
    pointsNeeded: number;
}
