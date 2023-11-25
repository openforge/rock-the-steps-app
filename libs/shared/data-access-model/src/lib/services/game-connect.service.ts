import { Injectable } from '@angular/core';
import { CapacitorGameConnect } from '@openforge/capacitor-game-connect';

import { User } from '../models/user.interface';

@Injectable({
    providedIn: 'root',
})
export class GameConnectService {
    public user: User; // * Property to store User data
    public leaderboardID = ''; // * Property to dynamically set the Leaderboard ID based on which platform the user is

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
        await CapacitorGameConnect.showLeaderboard({ leaderboardID: this.leaderboardID });
    }

    /**
     * * Function to submit score to a leaderboard table
     *
     * @param points as number
     */
    public async submitScore(points: number): Promise<void> {
        await CapacitorGameConnect.submitScore({ leaderboardID: this.leaderboardID, totalScoreAmount: points });
    }

    /**
     * * Function to get total user score
     *
     */
    public async getUserScore(): Promise<number> {
        return (await CapacitorGameConnect.getUserTotalScore({ leaderboardID: this.leaderboardID })).player_score;
    }
}
