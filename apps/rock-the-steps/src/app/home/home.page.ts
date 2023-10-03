import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreensEnum, User } from '@openforge/shared/data-access-model';
import { GameConnectService } from 'libs/shared/data-access-model/src/lib/services/game-connect.service';

@Component({
    selector: 'openforge-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit {
    public user: User;
    public screensEnum = ScreensEnum; // * Enum used for the navigation screen type safe
    public playerScore = 0;

    /**
     * * On Init, initilize the Phaser Singleton instance
     * The initialisation is delayed by 500ms to give the HomePage the chance to render
     * the <div class="phaser" id="forge-main">
     *
     * If we don't delay it, the canvas size in preload() and create() will be 0.
     * With the delay the canvas size will be set correctly.
     */
    constructor(private router: Router, private gameConnectService: GameConnectService) {}

    async ngOnInit(): Promise<void> {
        await this.gameCenterLogin();
    }

    /**
     * * Method used to navigate from the main screen
     *
     * @param screen Where the player is going to be navigated
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        await this.router.navigate([screen]);
    }

    /**
     * * Function to open the achievements interface from game services
     *
     */
    public async openAchievements(): Promise<void> {
        await this.gameConnectService.showAchievements();
    }

    /**
     * * Function to open the leaderboard interface from game services
     */
    public async openLeaderboard(): Promise<void> {
        await this.gameConnectService.openLeaderboards();
    }

    /**
     * * Function to login a user to game center
     *
     */
    public async gameCenterLogin(): Promise<void> {
        this.user = await this.gameConnectService.signIn();
    }

    public async getUserScore(): Promise<void> {
        const data = await this.gameConnectService.getUserScore();
        this.playerScore = data.player_score;
    }
}
