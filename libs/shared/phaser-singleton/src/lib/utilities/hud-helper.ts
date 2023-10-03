/* eslint-disable no-magic-numbers */
import { Preferences } from '@capacitor/preferences';
import { Character, GameEngineSingleton, MUSIC_BUTTON, MUTE_BUTTON, PAUSE_BUTTON, PAUSE_SCENE, POINTER_DOWN_EVENT } from '@openforge/shared/data-access-model';
import { Scene } from 'phaser';
import * as Phaser from 'phaser';

import { CONFIG } from '../config';

/**
 * * Method used to create the buttons of movement and jump
 *
 * @private
 */
export async function createButtons(scene: Scene): Promise<void> {
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
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
export async function toggleMusic(_scene: Scene, musicButton: Phaser.GameObjects.Image): Promise<void> {
    const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
    if (_scene && audioPreference === 'true') {
        await Preferences.set({ key: 'AUDIO_ON', value: 'false' });
        void GameEngineSingleton.audioService.pauseBackground();
        musicButton.setTexture(MUTE_BUTTON);
    } else {
        await Preferences.set({ key: 'AUDIO_ON', value: 'true' });
        void GameEngineSingleton.audioService.resumeBackground();
        musicButton.setTexture(MUSIC_BUTTON);
    }
}
