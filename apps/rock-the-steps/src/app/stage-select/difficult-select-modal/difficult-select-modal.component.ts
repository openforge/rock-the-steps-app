import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DifficultEnum } from '@openforge/shared/data-access-model';

@Component({
    selector: 'openforge-difficult-select-modal',
    templateUrl: './difficult-select-modal.component.html',
    styleUrls: ['./difficult-select-modal.component.scss'],
})
export class DifficultSelectModalComponent {
    public difficultEnum = DifficultEnum; // * Difficult enum used to select the difficulty from template

    constructor(private modalController: ModalController) {}

    public async dismissModal(difficult: DifficultEnum): Promise<void> {
        await this.modalController.dismiss(difficult, 'confirm');
    }
}
