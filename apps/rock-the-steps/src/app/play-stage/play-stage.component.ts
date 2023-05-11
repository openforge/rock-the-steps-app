/* eslint-disable @typescript-eslint/no-misused-promises */
import { Component, OnInit } from '@angular/core';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

@Component({
    selector: 'openforge-play-stage',
    templateUrl: './play-stage.component.html',
    styleUrls: ['./play-stage.component.scss'],
})
export class PlayStageComponent implements OnInit {
    async ngOnInit(): Promise<void> {
        setTimeout(this.initStageScene, 500);
    }

    async initStageScene(): Promise<void> {
        await PhaserSingletonService.init();
    }
}
