import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameEnum } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

import { GameEngineSingleton } from '../../../../../libs/shared/data-access-model/src/lib/classes/singletons/game-engine.singleton';

@Component({
    selector: 'openforge-play-stage',
    templateUrl: './play-stage.component.html',
    styleUrls: ['./play-stage.component.scss'],
})
export class PlayStageComponent implements OnInit {
    constructor(private router: Router) {}

    async ngOnInit(): Promise<void> {
        //* Inits phaser scene
        if (!PhaserSingletonService.activeGame) {
            GameEngineSingleton.points = 0;
            await this.initStageScene();
        }
        // * Listen for gameEventType to know if the user looses or won
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        GameEngineSingleton.gameEventType.subscribe(async (value: GameEnum) => {
            if (GameEnum.WIN === value) {
                await this.router.navigate(['/finish'], { queryParams: { r: GameEnum.WIN }, replaceUrl: true });
            } else if (GameEnum.EXIT === value) {
                await this.router.navigate(['/home'], { replaceUrl: true });
            } else {
                await this.router.navigate(['/finish'], { queryParams: { r: GameEnum.LOOSE }, replaceUrl: true });
            }
        });
    }

    /**
     * * Function to init Phaser Singleton
     *
     */
    private async initStageScene(): Promise<void> {
        await PhaserSingletonService.init();
    }
}
