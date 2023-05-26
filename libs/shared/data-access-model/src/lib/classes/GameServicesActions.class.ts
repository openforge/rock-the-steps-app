import { GameServices } from '@openforge/capacitor-game-services';

import { GameServicesEnum } from '../enums/game-services.enum';

export class GameServicesActions {
    /**
     * * Functio to sign in a user to the game center
     *
     */
    public async signIn(): Promise<void> {
        await GameServices.signIn();
    }
    /**
     * * Function to open the achievements interface
     *
     */
    public async showAchievements(): Promise<void> {
        await GameServices.showAchievements();
    }

    /**
     * * Function to complete an achievement by ID
     *
     */
    public async unlockAchievement(achievementID: string): Promise<void> {
        await GameServices.unlockAchievement({ achievementID });
    }

    /**
     * * Function to open the leaderboards interface
     *
     */
    public async openLeaderboards(): Promise<void> {
        await GameServices.showLeaderboard({ leaderboardId: GameServicesEnum.LEADERBOARDS_ID });
    }
}
