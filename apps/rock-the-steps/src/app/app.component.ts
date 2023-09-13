import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    constructor(public phaserInstance: PhaserSingletonService, public platform: Platform) {}

    async ngOnInit(): Promise<void> {
        if (this.platform.is('capacitor')) {
            this.setScreenOrientation();
        }
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
