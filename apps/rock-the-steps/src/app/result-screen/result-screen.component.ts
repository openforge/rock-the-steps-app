import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { GameEnum, Stage } from '@openforge/shared/data-access-model';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { TIMEOUT_REDIRECTION_TO_HOME_SCREEN } from '../../../../../libs/shared/data-access-model/src/lib/constants/game-units.constants';

@Component({
    selector: 'openforge-result-screen',
    templateUrl: './result-screen.component.html',
    styleUrls: ['./result-screen.component.scss'],
})
export class ResultScreenComponent implements OnInit {
    public displayWinBackground = false; // * Flag used to show conditionally the background for the user
    public gameSingleton = GameEngineSingleton; // * GameSingleton property used in the template

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

    async ngOnInit(): Promise<void> {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.r === GameEnum.WIN) {
                this.displayWinBackground = true;
                void this.setWinFunctionality();
            } else if (params.r === GameEnum.LOSE) {
                void this.setLoseFunctionality();
            }
        });
    }

    public async setWinFunctionality(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
        if (audioPreference === 'true') {
            void GameEngineSingleton.audioService.playSuccess();
        }
        void this.updateUserProgression();
        void setTimeout(() => {
            void this.gotoMainMenu();
        }, TIMEOUT_REDIRECTION_TO_HOME_SCREEN as number);
    }

    public async setLoseFunctionality(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
        if (audioPreference === 'true') {
            void GameEngineSingleton.audioService.playFail();
        }
    }

    /**
     * * Function to replay the current level
     *
     */
    public async replayLevel(): Promise<void> {
        await this.router.navigate(['/play-stage']);
    }

    /**
     * * Function to go to the main menu
     *
     */
    public async gotoMainMenu(): Promise<void> {
        await this.router.navigate(['/home']);
    }

    public async updateUserProgression(): Promise<void> {
        const userProgression = JSON.parse((await Preferences.get({ key: 'PROGRESSION' })).value) as Stage[];
        const progressionItem = userProgression.find(
            progression => progression.levelDifficulity === GameEngineSingleton.world.difficultyLevel && progression.levelName === GameEngineSingleton.world.worldType
        );

        const progressionItemIndex = userProgression.indexOf(progressionItem);

        userProgression[progressionItemIndex].hasCompletedOnce = true;
        if (progressionItem.bestScore > GameEngineSingleton.points) {
            userProgression[progressionItemIndex].bestScore = GameEngineSingleton.points;
        }

        await Preferences.set({ key: 'PROGRESSION', value: JSON.stringify(userProgression) });

        GameEngineSingleton.totalPoints = Number((await Preferences.get({ key: 'TOTAL_POINTS' })).value) + GameEngineSingleton.points;
        await Preferences.set({ key: 'TOTAL_POINTS', value: GameEngineSingleton.totalPoints.toString() });
    }
}
