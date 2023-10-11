/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-magic-numbers */
import CanvasInput from 'phaser3-rex-plugins/plugins/canvasinput.js';

import { GameEngineSingleton } from '../../../../data-access-model/src/lib/classes/singletons/game-engine.singleton';

export class SandboxScene extends Phaser.Scene {
    characterSpeedInput: CanvasInput;
    objectSpeedInput: CanvasInput;

    constructor() {
        console.log('sandbox.scene.ts', 'constructor()');
        super('SandboxScene');
    }

    /**
     * * Creating Modal to display
     *
     */
    create() {
        // Adds transparent background
        const modalOverlay = this.add.graphics();
        modalOverlay.fillStyle(0x000000, 0.5);
        modalOverlay.fillRect(0, 0, this.sys.canvas.width, this.sys.canvas.height);
        // Create a modal
        const modal = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2).setInteractive();
        // Add modal background
        const modalBackground = this.add.graphics();
        modalBackground.fillStyle(0xffffff, 1);
        modalBackground.fillRoundedRect(-400, -200, 800, 400, 10); // Border rounded
        modalBackground.lineStyle(14, 0xd3d3d3); // Border width
        modal.add(modalBackground);

        const modalText = this.add.text(0, -180, 'Sandbox Menu', { fontSize: '24px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5);
        modal.add(modalText);

        const labelStyle = {
            fontSize: '18px',
            color: '#ff0000',
            fontWeight: 'bold',
        };

        const label1 = this.add.text(-100, -15, 'Character Speed', labelStyle).setInteractive().setOrigin(0.5);
        this.characterSpeedInput = this.createInput(-105, 20);
        this.characterSpeedInput.setNumberInput();
        modal.add(this.characterSpeedInput);
        modal.add(label1);

        const label2 = this.add.text(80, -15, 'Objects Speed', labelStyle).setInteractive().setOrigin(0.5);
        this.objectSpeedInput = this.createInput(90, 20);
        this.objectSpeedInput.setNumberInput();
        modal.add(this.objectSpeedInput);
        modal.add(label2);

        const button = this.add.text(0, 180, 'Close', { color: '#000' }).setInteractive().setOrigin(0.5);
        button.on('pointerdown', this.resumeGame, this);
        modal.add(button);
    }

    /**
     * * Function to pause current scene
     *
     */
    private resumeGame(): void {
        this.scene.stop(); // Delete modal scene
        this.scene.resume('WorldScene');
        // console.log(this.characterSpeedInput.getText());
        // console.log(this.objectSpeedInput.getText());

        void GameEngineSingleton.audioService.resumeBackground();
    }

    private createInput(x: number, y: number) {
        const inputConfig: CanvasInput.IConfig = {
            textArea: false,
            x,
            y,
            width: undefined,
            height: undefined,
            padding: 2,
            background: {
                color: '#FFFFFF',
                color2: '#FFFFFF',
                cornerRadius: 6,
                stroke: '#000000',
                strokeThickness: 1,
            },
            style: {
                bold: false,
                italic: false,
                fontSize: '16px',
                fontFamily: 'Courier',
                color: '#000000',
                stroke: '#000000',
                strokeThickness: 0,
                shadowColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 0,
                backgroundColor: null,
                offsetX: 0,
                offsetY: 0,
            },
        };
        return new CanvasInput(this, x, y, 160, 40, inputConfig);
    }
}
