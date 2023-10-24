/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import { GameEnum } from '@openforge/shared/data-access-model';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/game-engine.singleton';
export class PauseScene extends Phaser.Scene {
    constructor() {
        console.log('pause.scene.ts', 'constructor()');
        super('PauseScene');
    }

    /**
     * * Creating Modal to display
     *
     */
    create() {
        // Adds transparent background
        const modalOverlay = this.add.graphics();
        modalOverlay.fillStyle(0x000000, 0.2);
        modalOverlay.fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);

        // Create a modal
        const modal = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2);

        // Add modal background
        const modalBackground = this.add.graphics();
        modalBackground.fillStyle(0xffffff, 0.7);
        modalBackground.lineStyle(4, 0x000000);
        modalBackground.fillRoundedRect(-200, -100, 400, 200, 10); // Border rounded
        modalBackground.strokeRoundedRect(-200, -100, 400, 200, 10); // Border rounded
        modalBackground.lineStyle(14, 0xd3d3d3); // Border width
        modal.add(modalBackground);

        const modalText = this.add.text(0, -40, 'PAUSED', { fontSize: '24px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5);
        modal.add(modalText);

        // Continue button
        const resumeButton = this.add
            .text(-80, 20, 'Continue', { fontSize: '20px', color: '#FFFFFF', fontStyle: 'bold', backgroundColor: '#3BB54A', padding: { left: 10, right: 10, top: 10, bottom: 10 } })
            .setOrigin(0.5)
            .setInteractive();
        resumeButton.on('pointerdown', this.resumeGame, this);
        modal.add(resumeButton);

        // Main menu button
        const mainMenuButton = this.add
            .text(80, 20, 'Main Menu', { fontSize: '20px', color: '#FFFFFF', fontStyle: 'bold', backgroundColor: '#BE1E2D', padding: { left: 10, right: 10, top: 10, bottom: 10 } })
            .setOrigin(0.5)
            .setInteractive();
        mainMenuButton.on('pointerdown', this.goToMainMenu, this);
        modal.add(mainMenuButton);
    }

    /**
     * * Function to pause current scene
     *
     */
    private resumeGame(): void {
        this.scene.stop(); // Delete modal scene
        this.scene.resume('WorldScene');
        void GameEngineSingleton.audioService.resumeBackground();
    }

    /**
     * * Here is where we switch between scenes based on User Selection.
     * * If User opens Pause Menu, it will switch.
     */
    private goToMainMenu(): void {
        this.scene.stop(); // Delete modal scene
        PhaserSingletonService.activeGame.destroy(true);
        PhaserSingletonService.activeGame = undefined;
        GameEngineSingleton.gameEventType.next(GameEnum.EXIT);
    }
}
