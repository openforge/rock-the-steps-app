import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DifficultyEnum } from '@openforge/shared/data-access-model';

@Component({
    selector: 'openforge-difficult-select-modal',
    templateUrl: './difficult-select-modal.component.html',
    styleUrls: ['./difficult-select-modal.component.scss'],
})
export class DifficultSelectModalComponent {
    public difficultEnum = DifficultyEnum; // * Difficult enum used to select the difficulty from template

    constructor(private modalController: ModalController) {}

    public async dismissModal(difficult: DifficultyEnum): Promise<void> {
        await this.modalController.dismiss(difficult, 'confirm');
    }
}
