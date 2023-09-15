import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { DifficultyEnum, GameEnum, LevelsEnum } from '@openforge/shared/data-access-model';
import { Subject } from 'rxjs';

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
    public static world = new World(); //* World where all the objects are created
    public static difficult: DifficultyEnum; // * Difficult for the velocity of the game
    public static points = 0; // * Number of points accomplished in the level
    public static totalPoints = 0; // * Number of points accomplished overal
    public static gameEventType = new Subject<GameEnum>();

    /**
     * Method used to initialize the world game and the objects
     *
     * @param level Level to be loaded
     */
    public static async buildWorld(level: LevelsEnum, difficulty: DifficultyEnum): Promise<void> {
        this.world = World.build(level, difficulty);
        this.totalPoints = Number((await Storage.get({ key: 'TOTAL_POINTS' })).value);
    }
}
