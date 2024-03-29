import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { GameEnum, PreferencesEnum, Stage } from '@openforge/shared/data-access-model';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/game-engine.singleton';
import { TIMEOUT_REDIRECTION_TO_HOME_SCREEN } from '../../../../../libs/shared/data-access-model/src/lib/constants/game-units.constants';

@Component({
    selector: 'openforge-result-screen',
    templateUrl: './result-screen.component.html',
    styleUrls: ['./result-screen.component.scss'],
})
export class ResultScreenComponent implements OnInit {
    public displayBackground = 'lose-state'; // * Flag used to show conditionally the background for the user
    public displayState = GameEnum.LOSE; // * Flag used to show conditionally the background for the user
    public gameEnum = GameEnum; // * Enum prop used in the template
    public gameSingleton = GameEngineSingleton; // * GameSingleton property used in the template

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

    async ngOnInit(): Promise<void> {
        this.activatedRoute.queryParams.subscribe(params => {
            this.displayState = params.r as GameEnum;
            this.displayBackground = `${params.r}-state`.toLowerCase();
            if (params.r === GameEnum.WIN || params.r === GameEnum.ENDLESS) {
                void this.setWinFunctionality();
            } else if (params.r === GameEnum.LOSE) {
                void this.setLoseFunctionality();
            }
        });
    }

    public async setWinFunctionality(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'EFFECTS_ON' })).value;
        if (audioPreference === 'true') {
            void GameEngineSingleton.audioService.playSuccess();
        }
        void this.updateUserProgression();
        void setTimeout(() => {
            void this.gotoMainMenu();
        }, TIMEOUT_REDIRECTION_TO_HOME_SCREEN as number);
    }

    public async setLoseFunctionality(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'EFFECTS_ON' })).value;
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
        const userProgression = JSON.parse((await Preferences.get({ key: PreferencesEnum.PROGRESSION })).value) as Stage[];
        const progressionItem = userProgression.find(
            progression => progression.levelDifficulty === GameEngineSingleton.world.difficultyLevel && progression.levelName === GameEngineSingleton.world.worldType
        );

        const progressionItemIndex = userProgression.indexOf(progressionItem);

        if (progressionItem.bestScore > GameEngineSingleton.points || progressionItem.bestScore === 0) {
            userProgression[progressionItemIndex].bestScore = GameEngineSingleton.points;
        }

        if (!progressionItem.hasCompletedOnce) {
            GameEngineSingleton.totalPoints = Number((await Preferences.get({ key: PreferencesEnum.TOTAL_POINTS })).value) + GameEngineSingleton.points;
            await Preferences.set({ key: PreferencesEnum.TOTAL_POINTS, value: GameEngineSingleton.totalPoints.toString() });
        }
        userProgression[progressionItemIndex].hasCompletedOnce = true;
        await Preferences.set({ key: PreferencesEnum.PROGRESSION, value: JSON.stringify(userProgression) });
    }
}
