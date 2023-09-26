import { DifficultyEnum, LevelsEnum } from '../enums';

export interface Stage {
    id: string;
    levelName: LevelsEnum;
    levelDifficulity: DifficultyEnum;
    hasCompletedOnce: boolean;
    bestScore: number;
}
