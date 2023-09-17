import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameEnum } from '@openforge/shared/data-access-model';

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
                void setTimeout(() => void this.router.navigate(['/home']), TIMEOUT_REDIRECTION_TO_HOME_SCREEN as number);
            }
        });
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
}
