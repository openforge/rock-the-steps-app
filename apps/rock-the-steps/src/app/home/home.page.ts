import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'openforge-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePageComponent implements OnInit {
    /**
     * * On Init, initilize the Phaser Singleton instance
     * The initialisation is delayed by 500ms to give the HomePage the chance to render
     * the <div class="phaser" id="forge-main">
     *
     * If we don't delay it, the canvas size in preload() and create() will be 0.
     * With the delay the canvas size will be set correctly.
     */
    async ngOnInit(): Promise<void> {
        console.log('HomePageComponent', 'ngOnInit');
    }
}
