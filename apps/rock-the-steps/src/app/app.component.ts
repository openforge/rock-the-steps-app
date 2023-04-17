import { Component, OnDestroy } from '@angular/core';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

@Component({
    selector: 'openforge-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
    constructor(public phaserInstance: PhaserSingletonService) {}

    /**
     * * Need to handle the destroy method so we dont lock up our computer!
     */
    ngOnDestroy(): void {
        PhaserSingletonService.destroyActiveGame();
    }
}
