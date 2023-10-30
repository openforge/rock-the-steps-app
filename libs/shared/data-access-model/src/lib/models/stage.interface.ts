import { DifficultyEnum, LevelsEnum } from '../enums';

export interface Stage {
    id: string;
    levelName: LevelsEnum;
    levelDifficulty: DifficultyEnum;
    hasCompletedOnce: boolean;
    bestScore: number;
}
