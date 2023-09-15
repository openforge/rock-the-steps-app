import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameServicesActions, ScreensEnum } from '@openforge/shared/data-access-model';

@Component({
    selector: 'openforge-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent {
    public screensEnum = ScreensEnum; // * Enum used for the navigation screen type safe
    private gameServicesActions: GameServicesActions = new GameServicesActions();

    /**
     * * On Init, initilize the Phaser Singleton instance
     * The initialisation is delayed by 500ms to give the HomePage the chance to render
     * the <div class="phaser" id="forge-main">
     *
     * If we don't delay it, the canvas size in preload() and create() will be 0.
     * With the delay the canvas size will be set correctly.
     */
    constructor(private router: Router) {}

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
        await this.gameServicesActions.showAchievements();
    }

    /**
     * * Function to open the leaderboard interface from game services
     */
    public async openLeaderboard(): Promise<void> {
        await this.gameServicesActions.openLeaderboards();
    }

    /**
     * * Function to login a user to game center
     *
     */
    public async gameCenterLogin(): Promise<void> {
        await this.gameServicesActions.signIn();
    }
}
