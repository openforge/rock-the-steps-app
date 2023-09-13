/* eslint-disable no-magic-numbers */
import {
    BUTTON_JUMP_X,
    BUTTON_LEFT_X,
    BUTTON_RIGHT_X,
    BUTTONS_MOVE_Y,
    Character,
    CONTROLS_KEY,
    DOWN_EVENT,
    JUMP_KEY,
    LEFT_KEY,
    PAUSE_BUTTON,
    PAUSE_SCENE,
    POINTER_DOWN_EVENT,
    POINTER_UP_EVENT,
    RIGHT_KEY,
    UP_EVENT,
} from '@openforge/shared/data-access-model';
import { Scene } from 'phaser';

import { CONFIG } from '../config';

/**
 * * Method used to create the buttons of movement and jump
 *
 * @private
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createButtons(scene: Scene, character: Character, spaceBarKey: Phaser.Input.Keyboard.Key): void {
    const buttonLeft = scene.add.sprite(BUTTON_LEFT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, LEFT_KEY);
    buttonLeft.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonLeft.setInteractive();
    buttonLeft.on(POINTER_DOWN_EVENT, () => (character.isMovingLeft = true), scene);
    buttonLeft.on(POINTER_UP_EVENT, () => (character.isMovingLeft = false), scene);
    const buttonRight = scene.add.sprite(BUTTON_RIGHT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, RIGHT_KEY);
    buttonRight.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonRight.setInteractive();
    buttonRight.on(POINTER_DOWN_EVENT, () => (character.isMovingRight = true), scene);
    buttonRight.on(POINTER_UP_EVENT, () => (character.isMovingRight = false), scene);
    const buttonJump = scene.add.sprite(CONFIG.DEFAULT_WIDTH - BUTTON_JUMP_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, JUMP_KEY);
    buttonJump.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonJump.setInteractive();
    buttonJump.on(POINTER_DOWN_EVENT, () => (character.isJumping = true), scene);
    buttonJump.on(POINTER_UP_EVENT, () => (character.isJumping = false), scene);
    spaceBarKey.on(DOWN_EVENT, () => (character.isJumping = true), scene);
    spaceBarKey.on(UP_EVENT, () => (character.isJumping = false), scene);

    const pauseButton = scene.add
        .image(CONFIG.DEFAULT_WIDTH * 0.95, CONFIG.DEFAULT_HEIGHT * 0.05, PAUSE_BUTTON)
        .setScale(0.1)
        .setOrigin(1, 0)
        .setInteractive();
    pauseButton.on(POINTER_DOWN_EVENT, () => showPauseModal(scene), scene);
}

/**
 * Method used to display pause modal
 *
 * @private
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function showPauseModal(_scene: Scene): void {
    if (_scene) {
        _scene.scene.pause();
        _scene.scene.run(PAUSE_SCENE);
    }
}
