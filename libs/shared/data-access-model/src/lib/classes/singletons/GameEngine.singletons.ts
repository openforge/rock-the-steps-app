import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DifficultEnum, GameEnum, LevelsEnum } from '@openforge/shared/data-access-model';
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
    public static world: World = new World(); //* World were all the objects are created
    // eslint-disable-next-line no-magic-numbers
    public static difficult: DifficultEnum; // * Difficult for the velocity of the game
    public static points = 10000; // * Number of points accomplished
    public static gameEventBus = new Subject<GameEnum>();
    public static scene: Phaser.Scenes.ScenePlugin; // * MainScene used to restart the games
    /**
     * Method used to initialize the world game and the objects
     *
     * @param level Level to be loaded
     */
    public static buildWorld(level: LevelsEnum, difficulty: DifficultEnum): void {
        this.world = World.build(level, difficulty);
    }
}
