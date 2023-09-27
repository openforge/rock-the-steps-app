import { Component } from '@angular/core';
import { DifficultyEnum } from '@openforge/shared/data-access-model';

import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'openforge-difficult-select-modal',
    templateUrl: './difficult-select-modal.component.html',
    styleUrls: ['./difficult-select-modal.component.scss'],
})
export class DifficultSelectModalComponent {
    public difficultEnum = DifficultyEnum; // * Difficult enum used to select the difficulty from template

    constructor(private modalService: ModalService) {}

    public async dismissModal(difficult: DifficultyEnum): Promise<void> {
        await this.modalService.dismiss({ difficult });
    }
}
