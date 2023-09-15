import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
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
    public gameSingleton = GameEngineSingleton;
    constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
    async ngOnInit(): Promise<void> {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.r === GameEnum.WIN) {
                this.displayWinBackground = true;
                void this.updateUserProgression();
                void setTimeout(() => {
                    void this.gotoMainMenu();
                }, TIMEOUT_REDIRECTION_TO_HOME_SCREEN as number);
            }
        });
    }

    public async replayLevel(): Promise<void> {
        await this.router.navigate(['/play-stage']);
    }

    public async gotoMainMenu(): Promise<void> {
        await this.router.navigate(['/home']);
    }

    public async updateUserProgression(): Promise<void> {
        const userProgression = JSON.parse((await Storage.get({ key: 'PROGRESSION' })).value) as Stage[];
        const progressionItem = userProgression.find(
            progression => progression.levelDifficulity === GameEngineSingleton.world.difficultyLevel && progression.levelName === GameEngineSingleton.world.worldType
        );

        const progressionItemIndex = userProgression.indexOf(progressionItem);

        userProgression[progressionItemIndex].hasCompletedOnce = true;
        if (progressionItem.bestScore > GameEngineSingleton.points) {
            userProgression[progressionItemIndex].bestScore = GameEngineSingleton.points;
        }

        await Storage.set({ key: 'PROGRESSION', value: JSON.stringify(userProgression) });

        GameEngineSingleton.totalPoints = Number((await Storage.get({ key: 'TOTAL_POINTS' })).value) + GameEngineSingleton.points;
        await Storage.set({ key: 'TOTAL_POINTS', value: GameEngineSingleton.totalPoints.toString() });
    }
}
