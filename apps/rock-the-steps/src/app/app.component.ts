import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameServices } from '@openforge/capacitor-game-services';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    constructor(public phaserInstance: PhaserSingletonService) {}

    async ngOnInit(): Promise<void> {
        await GameServices.signIn();
    }

    /**
     * * Function to sign in a user to game center
     * * It needs to be everytime the user open the app because Game Center didn't storage the user login
     *
     */
    public async signInGameServices(): Promise<void> {
        await GameServices.signIn();
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }
}
