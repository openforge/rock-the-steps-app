import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LevelsEnum, ScreensEnum } from '@openforge/shared/data-access-model';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/GameEngine.singletons';
import { DifficultSelectModalComponent } from './difficult-select-modal/difficult-select-modal.component';

@Component({
    selector: 'openforge-stage-select',
    templateUrl: './stage-select.component.html',
    styleUrls: ['./stage-select.component.scss'],
})
export class StageSelectComponent {
    public gameEngineSingleton = GameEngineSingleton; // * Singleton used to measure user points and unlock levels
    public levelsEnum = LevelsEnum; // * Enum used to distinguish level selection from user
    public screensEnums = ScreensEnum; // * Enum used to navigate across the screens

    constructor(private router: Router, private modalCtrl: ModalController) {}

    /**
     * Method used to load the selected level
     *
     * @param level selected level
     */
    public async selectLevel(level: LevelsEnum): Promise<void> {
        console.log(`Selected ${level}`);

        const modal = await this.modalCtrl.create({
            component: DifficultSelectModalComponent,
            cssClass: 'difficult-modal',
        });
        await modal.present();

        await modal.onWillDismiss().then(async (action: { role: string; data: number }) => {
            if (action.role !== 'backdrop') {
                console.log('Modal response', action);
                GameEngineSingleton.difficult = action.data;

                // * Here load the level
                GameEngineSingleton.buildWorld(level);
                await this.router.navigate(['play-stage']);
            }
        });
    }

    /**
     * Method used to navigate to other screens
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        await this.router.navigate([screen]);
    }
}
