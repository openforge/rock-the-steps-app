/* eslint-disable no-magic-numbers */
import { Preferences } from '@capacitor/preferences';
import {
    BUTTON_JUMP_X,
    BUTTON_LEFT_X,
    BUTTON_RIGHT_X,
    BUTTONS_MOVE_Y,
    Character,
    CONTROLS_KEY,
    DOWN_EVENT,
    GameEngineSingleton,
    JUMP_KEY,
    LEFT_KEY,
    MUSIC_BUTTON,
    MUTE_BUTTON,
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
export async function createButtons(scene: Scene, character: Character, spaceBarKey: Phaser.Input.Keyboard.Key): Promise<void> {
    const buttonLeft = scene.add.sprite(BUTTON_LEFT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, LEFT_KEY);
    buttonLeft.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonLeft.setInteractive();
    buttonLeft.setDepth(2);
    buttonLeft.on(POINTER_DOWN_EVENT, () => (character.isMovingLeft = true), scene);
    buttonLeft.on(POINTER_UP_EVENT, () => (character.isMovingLeft = false), scene);
    const buttonRight = scene.add.sprite(BUTTON_RIGHT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, RIGHT_KEY);
    buttonRight.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonRight.setInteractive();
    buttonRight.setDepth(2);
    buttonRight.on(POINTER_DOWN_EVENT, () => (character.isMovingRight = true), scene);
    buttonRight.on(POINTER_UP_EVENT, () => (character.isMovingRight = false), scene);
    const buttonJump = scene.add.sprite(CONFIG.DEFAULT_WIDTH - BUTTON_JUMP_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, JUMP_KEY);
    buttonJump.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonJump.setInteractive();
    buttonJump.setDepth(2);
    buttonJump.on(POINTER_DOWN_EVENT, () => doJumpMovement(scene, character), scene);
    buttonJump.on(POINTER_UP_EVENT, () => (character.isJumping = false), scene);
    spaceBarKey.on(DOWN_EVENT, () => (character.isJumping = true), scene);
    spaceBarKey.on(UP_EVENT, () => (character.isJumping = false), scene);
    const pauseButton = scene.add
        .image(CONFIG.DEFAULT_WIDTH * 0.95, CONFIG.DEFAULT_HEIGHT * 0.05, PAUSE_BUTTON)
        .setScale(0.1)
        .setOrigin(1, 0)
        .setInteractive();

    pauseButton.setDepth(2);
    pauseButton.on(POINTER_DOWN_EVENT, () => showPauseModal(scene), scene);

    const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;

    let audioButton = MUTE_BUTTON;
    if (audioPreference === 'true' || audioPreference === undefined) {
        audioButton = MUSIC_BUTTON;
    }

    const musicButton = scene.add
        .image(CONFIG.DEFAULT_WIDTH * 0.85, CONFIG.DEFAULT_HEIGHT * 0.05, audioButton)
        .setScale(0.1)
        .setOrigin(1, 0)
        .setInteractive();

    musicButton.setDepth(2);
    musicButton.on(POINTER_DOWN_EVENT, () => toggleMusic(scene, musicButton), scene);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function doJumpMovement(scene: Scene, character: Character): void {
    if (scene) {
        character.isJumping = true;
        if (GameEngineSingleton.audioService.activeMusic) {
            GameEngineSingleton.audioService.playJump(scene);
        }
    }
}

/**
 * * Method used to display pause modal
 *
 * @private
 */
export function showPauseModal(_scene: Scene): void {
    if (_scene) {
        _scene.scene.pause();
        _scene.scene.run(PAUSE_SCENE);
        if (GameEngineSingleton.audioService.activeMusic) {
            void GameEngineSingleton.audioService.pauseBackground();
        }
    }
}
/**
 * * Method used to toggle music
 *
 * @private
 */
export function toggleMusic(_scene: Scene, musicButton: Phaser.GameObjects.Image): void {
    if (_scene && GameEngineSingleton.audioService.activeMusic) {
        void GameEngineSingleton.audioService.pauseBackground();
        musicButton.setTexture(MUTE_BUTTON);
    } else {
        void GameEngineSingleton.audioService.playBackground(_scene);
        musicButton.setTexture(MUSIC_BUTTON);
    }
}
