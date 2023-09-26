import { Component, OnDestroy, OnInit } from '@angular/core';
import { Network } from '@capacitor/network';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { ModalController, Platform } from '@ionic/angular';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

import { InternetConnectionFailComponent } from './network/internet-connection-fail/internet-connection-fail.component';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    constructor(public phaserInstance: PhaserSingletonService, public platform: Platform, private modalController: ModalController) {}

    async ngOnInit(): Promise<void> {
        if (this.platform.is('capacitor')) {
            this.setScreenOrientation();
        }
        void this.checkInternetConnection();
    }

    /**
     * * Function to set screen orientation to only use landscape
     *
     */
    private setScreenOrientation(): void {
        void ScreenOrientation.lock({ orientation: 'landscape-primary' });
    }

    /**
     * * Function to check network status
     *
     */
    private async checkInternetConnection(): Promise<void> {
        const connectionStatus = await Network.getStatus();
        if (connectionStatus.connectionType === 'none') {
            void this.showNetworkModal();
        }
        void Network.addListener('networkStatusChange', status => {
            if (status.connectionType === 'none') {
                void this.showNetworkModal();
            }
        });
    }

    /**
     * * Function to display Networt Connection Modal
     *
     */
    private async showNetworkModal(): Promise<void> {
        const modalCtrl = await this.modalController.create({
            component: InternetConnectionFailComponent,
            canDismiss: false,
        });
        await modalCtrl.present();
    }

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }
}
