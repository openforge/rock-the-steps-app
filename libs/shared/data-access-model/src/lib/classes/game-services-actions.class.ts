import { CapacitorGameConnect } from '@openforge/capacitor-game-connect';

import { GameServicesEnum } from '../enums/game-services.enum';

export class GameServicesActions {
    /**
     * * Functio to sign in a user to the game center
     *
     */
    public async signIn(): Promise<void> {
        await CapacitorGameConnect.signIn();
    }
    /**
     * * Function to open the achievements interface
     *
     */
    public async showAchievements(): Promise<void> {
        await CapacitorGameConnect.showAchievements();
    }

    /**
     * * Function to complete an achievement by ID
     *
     */
    public async unlockAchievement(achievementID: string): Promise<void> {
        await CapacitorGameConnect.unlockAchievement({ achievementID });
    }

    /**
     * * Function to open the leaderboards interface
     *
     */
    public async openLeaderboards(): Promise<void> {
        await CapacitorGameConnect.showLeaderboard({ leaderboardID: GameServicesEnum.LEADERBOARDS_ID });
    }

    /**
     * * Function to submit score to a leaderboard table
     *
     * @param points as number
     */
    public async submitScore(points: number): Promise<void> {
        await CapacitorGameConnect.submitScore({ leaderboardID: GameServicesEnum.LEADERBOARDS_ID, totalScoreAmount: points });
    }
}
