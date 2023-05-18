/* eslint-disable @typescript-eslint/no-misused-promises */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameEnum } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/GameEngine.singletons';

@Component({
    selector: 'openforge-play-stage',
    templateUrl: './play-stage.component.html',
    styleUrls: ['./play-stage.component.scss'],
})
export class PlayStageComponent implements OnInit {
    constructor(private router: Router) {}
    async ngOnInit(): Promise<void> {
        //* Inits phaser scene
        setTimeout(this.initStageScene, 500);
        // * Listen for game bus to know if the user looses or won
        GameEngineSingleton.gameEventBus.subscribe(async (value: GameEnum) => {
            if (GameEnum.WIN === value) {
                await this.router.navigate(['/finish'], { queryParams: { r: GameEnum.WIN } });
            } else {
                await this.router.navigate(['/finish'], { queryParams: { r: GameEnum.LOOSE } });
            }
        });
    }

    async initStageScene(): Promise<void> {
        await PhaserSingletonService.init();
    }
}
