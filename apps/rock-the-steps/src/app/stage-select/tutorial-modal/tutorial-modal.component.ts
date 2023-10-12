import { Component } from '@angular/core';

import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'openforge-tutorial-modal',
    templateUrl: './tutorial-modal.component.html',
    styleUrls: ['./tutorial-modal.component.scss'],
})
export class TutorialModalComponent {
    public activeIndex = 1; //* Active slide to display the steps
    public sprites = [];
    constructor(private modalService: ModalService) {}

    /**
     * Method used to hide the tutorial
     */
    public async dismissModal(): Promise<void> {
        await this.modalService.dismiss();
    }

    /**
     * Method used to see the next tutorial
     */
    public moveSlide(slide: number): void {
        this.activeIndex += slide;
    }
}
