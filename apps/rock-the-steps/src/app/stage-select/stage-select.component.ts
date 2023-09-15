import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { DifficultyEnum, GameServicesActions, LevelsEnum, ScreensEnum } from '@openforge/shared/data-access-model';
import { Stage } from 'libs/shared/data-access-model/src/lib/models/stage.interface';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { DifficultSelectModalComponent } from './difficult-select-modal/difficult-select-modal.component';

@Component({
    selector: 'openforge-stage-select',
    templateUrl: './stage-select.component.html',
    styleUrls: ['./stage-select.component.scss'],
})
export class StageSelectComponent implements OnInit {
    public gameEngineSingleton = GameEngineSingleton; // * Singleton used to measure user points and unlock levels
    public levelsEnum = LevelsEnum; // * Enum used to distinguish level selection from user
    public difficultyEnum = DifficultyEnum; // * Enum used to distingush difficulity
    public screensEnums = ScreensEnum; // * Enum used to navigate across the screens
    private gameServicesActions: GameServicesActions = new GameServicesActions();
    public allPointsEarned = 0; // * Number of points the user has earened playing

    // * TODO update this solution to generate in a class
    public progression: Stage[] = [
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulity: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulity: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulity: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
    ];

    constructor(private router: Router, private modalCtrl: ModalController) {}

    async ngOnInit() {
        this.allPointsEarned = Number((await Storage.get({ key: 'TOTAL_POINTS' })).value);

        const userProgression = await Storage.get({ key: 'PROGRESSION' });
        if (!userProgression.value) {
            await Storage.set({ key: 'PROGRESSION', value: JSON.stringify(this.progression) });
        } else {
            this.progression = JSON.parse(userProgression.value) as Stage[];
        }
    }

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
                GameEngineSingleton.difficult = action.data;

                // * Here load the level
                void GameEngineSingleton.buildWorld(level, action.data);
                await this.goTo(ScreensEnum.PLAY_STAGE);
            }
        });
    }

    /**
     * Method used to navigate to other screens
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        if (screen === this.screensEnums.LEADERBOARDS) {
            await this.gameServicesActions.openLeaderboards();
        } else {
            await this.router.navigate([screen]);
        }
    }
}
