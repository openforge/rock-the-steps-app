import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DifficultyEnum, GameEnum, LevelsEnum } from '@openforge/shared/data-access-model';
import * as Phaser from 'phaser';
import { Subject } from 'rxjs';

import { World } from '../world.class';

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
    public static world = new World(); //* World were all the objects are created
    public static difficult: DifficultyEnum; // * Difficult for the velocity of the game
    public static points = 10000; // * Number of points accomplished
    public static gameEventBus = new Subject<GameEnum>();
    public static scene: Phaser.Scenes.ScenePlugin; // * MainScene used to restart the games
    /**
     * Method used to initialize the world game and the objects
     *
     * @param level Level to be loaded
     */
    public static buildWorld(level: LevelsEnum, difficulty: DifficultyEnum): void {
        this.world = World.build(level, difficulty);
    }
}
