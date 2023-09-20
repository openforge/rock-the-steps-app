import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'openforge-internet-connection-fail',
    templateUrl: './internet-connection-fail.component.html',
    styleUrls: ['./internet-connection-fail.component.scss'],
})
export class InternetConnectionFailComponent {
    constructor(private router: Router, private loadingController: LoadingController, private alertController: AlertController) {}

    /**
     * * Function to retrieve newtork status
     *
     */
    public async retryNetworkConnection(): Promise<void> {
        const loadingCtrl = await this.loadingController.create({
            message: 'Retrying connection...',
        });
        await loadingCtrl.present();

        // * Retrieving network connection
        const networkStatus = await Network.getStatus();
        if (networkStatus.connectionType === 'none') {
            void this.loadingController.dismiss();
            void this.router.navigate(['home'], { replaceUrl: true });
        } else {
            void this.loadingController.dismiss();
            const alertCtrl = await this.alertController.create({
                header: 'Connection Error',
                message: 'We still have some issues trying to retrieve your network status again.',
                buttons: [{ text: 'Okay' }],
            });
            await alertCtrl.present();
        }
    }
}
