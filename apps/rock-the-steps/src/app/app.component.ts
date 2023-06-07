import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameServicesActions } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    private gameServicesActions: GameServicesActions = new GameServicesActions();
    constructor(public phaserInstance: PhaserSingletonService) {}

    async ngOnInit(): Promise<void> {
        this.setScreenOrientation();
        await this.signInGameServices();
    }

    /**
     * * Function to sign in a user to game center
     * * It needs to be everytime the user open the app because Game Center didn't storage the user login
     *
     */
    public async signInGameServices(): Promise<void> {
        await this.gameServicesActions.signIn();
    }

    /**
     * * Function to set screen orientation to only use landscape
     *
     */
    private setScreenOrientation(): void {
        void window.screen.orientation.lock('landscape');
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }
}
