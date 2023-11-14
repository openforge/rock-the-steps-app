import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { PreferencesEnum, ScreensEnum, User } from '@openforge/shared/data-access-model';
import { GameConnectService } from 'libs/shared/data-access-model/src/lib/services/game-connect.service';

import { ModalService } from '../services/modal.service';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@Component({
    selector: 'openforge-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit {
    public user: User;
    public screensEnum = ScreensEnum; // * Enum used for the navigation screen type safe
    public showHome = false; // * Flag used to show the welcome screen by the fist time

    /**
     * * On Init, initilize the Phaser Singleton instance
     * The initialisation is delayed by 500ms to give the HomePage the chance to render
     * the <div class="phaser" id="forge-main">
     *
     * If we don't delay it, the canvas size in preload() and create() will be 0.
     * With the delay the canvas size will be set correctly.
     */
    constructor(private router: Router, private gameConnectService: GameConnectService, private modalService: ModalService) {}

    async ngOnInit(): Promise<void> {
        await this.gameCenterLogin();
        // If is a user in their first time show repo main screen
        const isKnownUser = (await Preferences.get({ key: PreferencesEnum.KNOWN_USER })).value === 'true';
        if (isKnownUser) {
            this.showHome = true;
        }
    }

    /**
     * * Method used to navigate from the main screen
     *
     * @param screen Where the player is going to be navigated
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        if (screen !== ScreensEnum.MAIN_MENU) {
            await this.router.navigate([screen]);
        } else {
            this.showHome = true;
            await Preferences.set({ key: PreferencesEnum.KNOWN_USER, value: 'true' });
        }
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

    public async openSettings(): Promise<void> {
        await this.modalService
            .showModal({
                component: SettingsModalComponent,
                cssClass: 'difficult-modal',
                backdropDismiss: false,
            })
            .then(() => this.modalService.modalElement);

        void this.modalService.modalElement.onWillDismiss();
    }

    /**
     * * Function to login a user to game center
     *
     */
    public async gameCenterLogin(): Promise<void> {
        this.user = await this.gameConnectService.signIn();
    }
}
