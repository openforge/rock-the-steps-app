/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { DifficultyEnum, LevelsEnum, PreferencesEnum, ScreensEnum } from '@openforge/shared/data-access-model';
import { Stage } from 'libs/shared/data-access-model/src/lib/models/stage.interface';
import { GameConnectService } from 'libs/shared/data-access-model/src/lib/services/game-connect.service';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { ModalService } from '../services/modal.service';
import { DifficultSelectModalComponent } from './difficult-select-modal/difficult-select-modal.component';
import { TutorialModalComponent } from './tutorial-modal/tutorial-modal.component';

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
    public allPointsEarned = 0; // * Number of points the user has earned playing
    public progression?: Stage[]; // * Prop used to manage the user progression
    // * TODO update this solution to generate in a class
    public originalProgressionObj: Stage[] = [
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.DAYTIME}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.DAYTIME,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.SUNSET}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.SUNSET,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.NIGHT}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.NIGHT,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.KELLY_DRIVE}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.KELLY_DRIVE,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.RITTEN_HOUSE}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.RITTEN_HOUSE,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.EASY}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulty: DifficultyEnum.EASY,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.MEDIUM}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulty: DifficultyEnum.MEDIUM,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.HARD}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulty: DifficultyEnum.HARD,
            hasCompletedOnce: false,
            bestScore: 0,
        },
        {
            id: `${LevelsEnum.CHINA_TOWN}.${DifficultyEnum.ENDLESS}`,
            levelName: LevelsEnum.CHINA_TOWN,
            levelDifficulty: DifficultyEnum.ENDLESS,
            hasCompletedOnce: false,
            bestScore: 0,
        },
    ];

    constructor(private router: Router, private modalService: ModalService, private gameConnectService: GameConnectService) {}

    async ngOnInit() {
        let currentPoints = Number((await Preferences.get({ key: 'TOTAL_POINTS' })).value) || 0;

        if (currentPoints === 0) {
            // If no points from storage we will check at lederboards, b/c it could be a existing user who reinstalled
            currentPoints = (await this.gameConnectService.getUserScore())?.player_score || 0;
        }

        this.allPointsEarned = currentPoints;
        const alreadySawTutorial = await Preferences.get({ key: PreferencesEnum.TUTORIAL });

        if (!alreadySawTutorial.value) {
            await this.showTutorial();
            await Preferences.set({ key: PreferencesEnum.TUTORIAL, value: 'true' });
        }

        // * Check if user has endless mode enable in permissions
        const userProgression = await Preferences.get({ key: PreferencesEnum.PROGRESSION });
        if (!userProgression.value) {
            this.progression = this.originalProgressionObj;
            await Preferences.set({ key: PreferencesEnum.PROGRESSION, value: JSON.stringify(this.originalProgressionObj) });
        } else {
            this.progression = JSON.parse(userProgression.value) as Stage[];
        }
        await this.checkIfHasEndlessMode();
    }

    /**
     * * Logic to know if user has ENDLESS mode in their Preferences
     *
     */
    public async checkIfHasEndlessMode(): Promise<void> {
        const userProgression = await Preferences.get({ key: PreferencesEnum.PROGRESSION });
        const userProgressionData = JSON.parse(userProgression.value) as Stage[];
        const hasEndlessMode = userProgressionData.filter(snap => snap.levelDifficulty === this.difficultyEnum.ENDLESS);

        if (hasEndlessMode.length === 0) {
            await Preferences.remove({ key: PreferencesEnum.PROGRESSION });
            await Preferences.set({ key: PreferencesEnum.PROGRESSION, value: JSON.stringify(this.originalProgressionObj) });
        }
    }

    /**
     * method used to show the tutorial to teach the players
     */
    public async showTutorial(): Promise<void> {
        await this.modalService
            .showModal({
                component: TutorialModalComponent,
                cssClass: 'tutorial-modal',
                backdropDismiss: false,
            })
            .then(() => this.modalService.modalElement);

        void this.modalService.modalElement.onWillDismiss();
    }

    /*
     * Method used to load the selected level
     *
     * @param level selected level
     */
    public async selectLevel(level: LevelsEnum, isPrevFinishedInEasy: boolean, isPrevFinishedInMid: boolean, isPrevFinishedInHard: boolean): Promise<void> {
        console.log(`Selected ${level}`);

        if (isPrevFinishedInEasy || isPrevFinishedInMid || isPrevFinishedInHard) {
            await this.modalService
                .showModal({
                    component: DifficultSelectModalComponent,
                    cssClass: 'difficult-modal',
                    backdropDismiss: false,
                    componentProps: {
                        level,
                        difficulties: this.progression.filter(stg => stg.levelName === level),
                        isPrevFinishedInEasy,
                        isPrevFinishedInMid,
                        isPrevFinishedInHard,
                    },
                })
                .then(() => this.modalService.modalElement);

            void this.modalService.modalElement.onWillDismiss().then(async (action: { role: string; data: { difficult: number } }) => {
                if (action.role !== 'backdrop' && action.data.difficult) {
                    GameEngineSingleton.difficult = action.data.difficult;

                    // * Here load the level
                    void GameEngineSingleton.buildWorld(level, action.data.difficult);
                    await this.goTo(ScreensEnum.PLAY_STAGE);
                }
            });
        }
    }

    /**
     * Method used to navigate to other screens
     */
    public async goTo(screen: ScreensEnum): Promise<void> {
        if (screen === this.screensEnums.LEADERBOARDS) {
            await this.gameConnectService.openLeaderboards();
        } else {
            await this.router.navigate([screen], { replaceUrl: true });
        }
    }
}
