import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LevelsEnum } from '@openforge/shared/data-access-model';

import { World } from '../World.class';

/**
 * * GameEngine Singleton Service
 * * This service controls the state management of the game and levels
 * ! GameEngine Loads FIRST so that assets can be loaded
 * * Singleton Pattern follows Angular standard https://angular.io/guide/singleton-services
 * */
@NgModule({
    imports: [CommonModule],
})
export class GameEngineSingleton {
    public static world: World; //* World were all the obstacles are created

    /**
     * Method used to initialize the world game and the objects
     *
     * @param level Level to be loaded
     */
    public static buildWorld(level: LevelsEnum): void {
        this.world = World.build(level);
    }
}
