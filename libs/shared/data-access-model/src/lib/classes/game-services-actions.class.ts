import { CapacitorGameConnect } from '@openforge/capacitor-game-connect';

import { GameServicesEnum } from '../enums/game-services.enum';
import { User } from '../models/user.interface';

export class GameServicesActions {
    private user: User;

    /**
     * * Function to sign in a user to the game center
     *
     */
    public async signIn(): Promise<User> {
        if (!this.user) {
            this.user = (await CapacitorGameConnect.signIn()) as User;
            return this.user;
        } else {
            return this.user;
        }
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
