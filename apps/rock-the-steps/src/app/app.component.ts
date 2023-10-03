import { Component, OnDestroy, OnInit } from '@angular/core';
import { Network } from '@capacitor/network';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { GameEngineSingleton, LEADERBOARD_ANDROID_ID, LEADERBOARD_IOS_ID, NOT_DEFINED } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import { GameConnectService } from 'libs/shared/data-access-model/src/lib/services/game-connect.service';

import { AudioService } from '../../../../libs/shared/data-access-model/src/lib/services/audio.service';
import { InternetConnectionFailComponent } from './network/internet-connection-fail/internet-connection-fail.component';
import { ModalService } from './services/modal.service';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    constructor(
        public phaserInstance: PhaserSingletonService,
        public platform: Platform,
        private modalService: ModalService,
        private gameConnectService: GameConnectService,
        private audioService: AudioService
    ) {}

    async ngOnInit(): Promise<void> {
        GameEngineSingleton.audioService = this.audioService;
        // * Setting the Leaderboard ID based on the platform
        if (this.platform.is('android')) {
            this.gameConnectService.leaderboardID = LEADERBOARD_ANDROID_ID;
        } else if (this.platform.is('ios')) {
            this.gameConnectService.leaderboardID = LEADERBOARD_IOS_ID;
        } else {
            this.gameConnectService.leaderboardID = NOT_DEFINED;
        }
        if (this.platform.is('capacitor')) {
            this.setScreenOrientation();
        }

        const connectionStatus = await Network.getStatus();
        if (connectionStatus.connectionType === 'none') {
            void this.showNetworkModal();
        }

        void Network.addListener('networkStatusChange', status => {
            if (status.connectionType === 'none') {
                void this.showNetworkModal();
            }

            if (status.connectionType !== 'none') {
                void this.modalService.dismiss();
            }
        });
    }

    /**
     * * Function to set screen orientation to only use landscape
     *
     */
    private setScreenOrientation(): void {
        void ScreenOrientation.lock({ orientation: 'landscape-primary' });
    }

    /**
     * * Function to display Networt Connection Modal
     *
     */
    private async showNetworkModal(): Promise<void> {
        await this.modalService.showModal({
            component: InternetConnectionFailComponent,
            backdropDismiss: false,
        });
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }
}
