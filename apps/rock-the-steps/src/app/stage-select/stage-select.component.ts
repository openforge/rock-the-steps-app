import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LevelsEnum, ScreensEnum } from '@openforge/shared/data-access-model';

@Component({
    selector: 'openforge-stage-select',
    templateUrl: './stage-select.component.html',
    styleUrls: ['./stage-select.component.scss'],
})
export class StageSelectComponent {
    public numberPoints: number = 0; // * Property used to measure user points and unlock levels
    public levelsEnum = LevelsEnum; // * Enum used to distinguish level selection from user
    public screensEnums = ScreensEnum; // * Enum used to navigate across the screens

    constructor(private router: Router) {}

    /**
     * Method used to load the selected level
     *
     * @param level selected level
     */
    public selectLevel(level: LevelsEnum): void {
        console.log(`Selected ${level}`);
        // * Here load the level
    }

    /**
     * Method used to navigate to other screens
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        await this.router.navigate([screen]);
    }
}
