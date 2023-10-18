/* eslint-disable no-magic-numbers */
import { Preferences } from '@capacitor/preferences';
import {
    BUTTON_LEFT_X,
    BUTTON_RIGHT_X,
    BUTTONS_MOVE_Y,
    Character,
    CONTROLS_KEY,
    CONTROLS_LEFT_KEY,
    CONTROLS_RIGHT_KEY,
    DOWN_EVENT,
    GameEngineSingleton,
    KEYDOWN_EVENT,
    KEYUP_EVENT,
    LEFT_KEY,
    LEFT_KEYBOARD,
    MUSIC_BUTTON,
    MUTE_BUTTON,
    PAUSE_BUTTON,
    PAUSE_SCENE,
    POINTER_DOWN_EVENT,
    POINTER_UP_EVENT,
    RIGHT_KEY,
    RIGHT_KEYBOARD,
    UP_EVENT,
    ZoneType,
} from '@openforge/shared/data-access-model';
import { Scene } from 'phaser';
import * as Phaser from 'phaser';

import { CONFIG } from '../config';
import { WorldScene } from '../scenes/world.scene';

/**
 * * Method used to create the buttons of movement and jump
 *
 * @private
 */
export async function createButtons(scene: Scene, spaceBarKey: Phaser.Input.Keyboard.Key, character: Character): Promise<void> {
    const pauseButton = scene.add
        .image(CONFIG.DEFAULT_WIDTH * 0.95, CONFIG.DEFAULT_HEIGHT * 0.05, PAUSE_BUTTON)
        .setScale(0.1)
        .setOrigin(1, 0)
        .setInteractive();

    pauseButton.setDepth(3);
    pauseButton.on(POINTER_DOWN_EVENT, () => showPauseModal(scene), scene);

    const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;

    let audioButton: string = MUTE_BUTTON;
    if (audioPreference === 'true' || audioPreference === undefined) {
        audioButton = MUSIC_BUTTON;
    }

    const musicButton = scene.add
        .image(CONFIG.DEFAULT_WIDTH * 0.85, CONFIG.DEFAULT_HEIGHT * 0.05, audioButton)
        .setScale(0.1)
        .setOrigin(1, 0)
        .setInteractive();

    musicButton.setDepth(3);
    musicButton.on(POINTER_DOWN_EVENT, () => toggleMusic(scene, musicButton), scene);
    spaceBarKey.on(DOWN_EVENT, () => doJumpMovement(scene, character), scene);
    spaceBarKey.on(UP_EVENT, () => (character.isJumping = false), scene);
}
/**
 * * Function to create the touch zones in the screen
 *
 * @param scene as WorldScene
 * @param character
 * @param spaceBarKey
 * @param keyboard
 */
export function createMovementButtons(scene: WorldScene, character: Character, spaceBarKey: Phaser.Input.Keyboard.Key, keyboard: Phaser.Input.Keyboard.KeyboardPlugin): void {
    console.log('world.scene.ts', 'buttons');
    const zoneWidth = (CONFIG.DEFAULT_WIDTH * 20) / 100;
    const zoneHeight = 200;
    const zoneJumpX = CONFIG.DEFAULT_WIDTH - zoneWidth * 0.5;
    const zoneY = CONFIG.DEFAULT_HEIGHT - zoneHeight * 0.3;
    const buttonLeft = scene.add.sprite(BUTTON_LEFT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, LEFT_KEY);
    buttonLeft.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonLeft.setInteractive();
    buttonLeft.setDepth(3);
    buttonLeft.on(
        POINTER_DOWN_EVENT,
        () => {
            buttonLeft.setTexture(CONTROLS_LEFT_KEY, LEFT_KEY);
            character.isMovingLeft = true;
        },
        scene
    );
    buttonLeft.on(
        POINTER_UP_EVENT,
        () => {
            buttonLeft.setTexture(CONTROLS_KEY, LEFT_KEY);
            character.isMovingLeft = false;
        },
        scene
    );
    const buttonRight = scene.add.sprite(BUTTON_RIGHT_X, CONFIG.DEFAULT_HEIGHT - BUTTONS_MOVE_Y, CONTROLS_KEY, RIGHT_KEY);
    buttonRight.setScale(CONFIG.DEFAULT_CONTROL_SCALE);
    buttonRight.setInteractive();
    buttonRight.setDepth(3);
    buttonRight.on(
        POINTER_DOWN_EVENT,
        () => {
            buttonRight.setTexture(CONTROLS_RIGHT_KEY, RIGHT_KEY);
            character.isMovingRight = true;
        },
        scene
    );
    buttonRight.on(
        POINTER_UP_EVENT,
        () => {
            buttonRight.setTexture(CONTROLS_KEY, RIGHT_KEY);
            character.isMovingRight = false;
        },
        scene
    );
    keyboard.on(
        KEYDOWN_EVENT,
        (ev: KeyboardEvent) => {
            if (ev.key === RIGHT_KEYBOARD) {
                buttonRight.setTexture(CONTROLS_RIGHT_KEY, RIGHT_KEY);
                character.isMovingRight = true;
            } else if (ev.key === LEFT_KEYBOARD) {
                buttonLeft.setTexture(CONTROLS_LEFT_KEY, LEFT_KEY);
                character.isMovingLeft = true;
            }
        },
        scene
    );
    keyboard.on(
        KEYUP_EVENT,
        (ev: KeyboardEvent) => {
            if (ev.key === RIGHT_KEYBOARD) {
                buttonRight.setTexture(CONTROLS_KEY, RIGHT_KEY);
                character.isMovingRight = false;
            } else if (ev.key === LEFT_KEYBOARD) {
                buttonLeft.setTexture(CONTROLS_KEY, LEFT_KEY);
                character.isMovingLeft = false;
            }
        },
        scene
    );
    const zoneJump = scene.add.zone(zoneJumpX, zoneY, zoneWidth, zoneHeight);
    zoneJump.setInteractive();
    zoneJump.on('pointerdown', () => zoneClicked(ZoneType.JUMP, true, scene));
    zoneJump.on('pointerup', () => zoneClicked(ZoneType.JUMP, false, scene));
    spaceBarKey.on(DOWN_EVENT, () => (character.isJumping = true), scene);
    spaceBarKey.on(UP_EVENT, () => (character.isJumping = false), scene);
}
/**
 * * Function that handle touch zone actions
 *
 * @param zoneType as ZoneType
 * @param action as the action to set
 * @param scene as WorldScene
 */
async function zoneClicked(zoneType: ZoneType, action: boolean, scene: WorldScene): Promise<void> {
    const audioPreference = (await Preferences.get({ key: 'EFFECTS_ON' })).value;
    switch (zoneType) {
        case ZoneType.JUMP:
            scene.character.isJumping = action;
            // * We set a timeout to prevent the character to keep jumping when user slides the controls
            setTimeout(() => {
                scene.character.isJumping = false;
            }, 500);
            if (audioPreference === 'true' && action) {
                GameEngineSingleton.audioService.playJump(scene);
            }
            break;
    }
}
export async function doJumpMovement(scene: Scene, character: Character): Promise<void> {
    const audioPreference = (await Preferences.get({ key: 'EFFECTS_ON' })).value;
    if (scene) {
        character.isJumping = true;
        if (audioPreference === 'true') {
            GameEngineSingleton.audioService.playJump(scene);
        }
    }
}

/**
 * * Method used to display pause modal
 *
 * @private
 */
export async function showPauseModal(_scene: Scene): Promise<void> {
    const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
    if (_scene) {
        _scene.scene.pause();
        _scene.scene.run(PAUSE_SCENE);
        if (audioPreference === 'true') {
            void GameEngineSingleton.audioService.pauseBackground();
        }
    }
}
/**
 * * Method used to toggle music
 *
 * @private
 */
export async function toggleMusic(scene: Scene, musicButton: Phaser.GameObjects.Image): Promise<void> {
    const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
    if (scene && audioPreference === 'true') {
        await Preferences.set({ key: 'AUDIO_ON', value: 'false' });
        void GameEngineSingleton.audioService.pauseBackground();
        musicButton.setTexture(MUTE_BUTTON);
    } else {
        await Preferences.set({ key: 'AUDIO_ON', value: 'true' });
        void GameEngineSingleton.audioService.playBackground(scene);
        musicButton.setTexture(MUSIC_BUTTON);
    }
}
