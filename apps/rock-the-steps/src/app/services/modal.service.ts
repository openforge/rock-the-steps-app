import { Injectable } from '@angular/core';
// eslint-disable-next-line import/named
import { ModalController, ModalOptions } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ModalService {
    public showingModal = false; //* This flag is used to know if the modal is already displayed
    public modalElement!: HTMLIonModalElement; // * Used to show modal

    constructor(private modalController: ModalController) {}

    /**
     * * Shows modal while data is being loaded
     */
    public async showModal(parameters: ModalOptions): Promise<void> {
        if (!this.showingModal) {
            this.modalElement = await this.modalController.create(parameters);
            await this.modalElement.present();
            this.showingModal = true;
        }
    }

    /**
     * * This function dismisses a modal and sets a flag indicating that the modal is no longer showing.
     */
    public async dismiss(parameters?: object): Promise<void> {
        try {
            await this.modalElement.dismiss(parameters);
            this.showingModal = false;
        } catch (e) {
            console.warn('Error with dismissing modal - ', e);
        }
    }
}
