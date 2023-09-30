import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameEnum, JUMP_KEYBOARD, LEFT_KEYBOARD, RIGHT_KEYBOARD, WORLD_SCENE } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';
import { WorldScene } from 'libs/shared/phaser-singleton/src/lib/scenes/world.scene';

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
                await this.router.navigate(['/finish'], { queryParams: { r: GameEnum.LOSE }, replaceUrl: true });
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

    /**
     * * Function to detect when keyboards arrow and space are press
     *
     * @param event as the KeyboardEvent
     * @param action as the action to set
     */
    public onKeyboardPress(event: KeyboardEvent, action: boolean) {
        switch (event.key) {
            case LEFT_KEYBOARD:
                this.moveToLeft(action);
                break;
            case RIGHT_KEYBOARD:
                this.moveToRight(action);
                break;
            case JUMP_KEYBOARD:
                this.doJump(action);
                break;
            default:
                break;
        }
    }

    /**
     * * Function to move the character to the left or not
     *
     * @param isMoving as boolean
     */
    public moveToLeft(isMoving: boolean): void {
        const worldScene = PhaserSingletonService.activeGame.scene.getScene(WORLD_SCENE) as WorldScene;
        worldScene.character.isMovingLeft = isMoving;
    }

    /**
     * * Function to move the character to the right or not
     *
     * @param isMoving as boolean
     */
    public moveToRight(isMoving: boolean): void {
        const worldScene = PhaserSingletonService.activeGame.scene.getScene(WORLD_SCENE) as WorldScene;
        worldScene.character.isMovingRight = isMoving;
    }

    /**
     * * Function to do character jump or not
     *
     * @param isJumping as boolean
     */
    public doJump(isJumping: boolean): void {
        const worldScene = PhaserSingletonService.activeGame.scene.getScene(WORLD_SCENE) as WorldScene;
        worldScene.character.isJumping = isJumping;
        if (GameEngineSingleton.audioService.activeMusic && isJumping) {
            GameEngineSingleton.audioService.playJump(worldScene);
        }
    }
}
