import { Component, OnInit } from '@angular/core';
import { DifficultyEnum, LevelsEnum, Stage } from '@openforge/shared/data-access-model';

import { World } from '../../../../../../libs/shared/data-access-model/src/lib/classes/World.class';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'openforge-difficult-select-modal',
    templateUrl: './difficult-select-modal.component.html',
    styleUrls: ['./difficult-select-modal.component.scss'],
})
export class DifficultSelectModalComponent implements OnInit {
    public difficultEnum = DifficultyEnum; // * Difficult enum used to select the difficulty from template
    public difficulties: Stage[] = []; // * Difficulties progress so we can enable the correct ones based on finished
    public level: LevelsEnum; //* Level selected used to calculate max points per level
    public levelDifficulties: {
        easyWorld: World;
        midWorld: World;
        hardWorld: World;
    }; //* Level difficulties objects to be displayed in the modal
    constructor(private modalService: ModalService) {}

    ngOnInit() {
        this.levelDifficulties = {
            easyWorld: World.build(this.level, this.difficultEnum.EASY),
            midWorld: World.build(this.level, this.difficultEnum.MEDIUM),
            hardWorld: World.build(this.level, this.difficultEnum.HARD),
        };
    }

    /**
     * Method used to close the modal of difficulties
     *
     * @param difficult
     */
    public async dismissModal(difficult?: DifficultyEnum): Promise<void> {
        await this.modalService.dismiss({ difficult });
    }
}
