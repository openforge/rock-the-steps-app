import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NativeAudio } from '@capacitor-community/native-audio';
import { Scene } from 'phaser';

import { BACKGROUND_AUDIO_KEY, JUMP_AUDIO_KEY } from '../constants/game-keys.constants';
import { GameEnum, PreferencesEnum } from '../enums';
@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private backgroundAudio: Phaser.Sound.BaseSound; // * Property to store background audio actions
    private jumpAudio: Phaser.Sound.BaseSound; // * Property to store jump audio actions
    private damageAudio: Phaser.Sound.BaseSound; // * Property to store damage audio actions
    private powerUpAudio: Phaser.Sound.BaseSound; // * Property to store power up audio actions

    /**
     * * Function to start playing the background audio file
     *
     * @param scene as Phaser.Scene
     * @param backgroundKey as string
     */
    public async playBackground(scene: Scene): Promise<void> {
        this.backgroundAudio = scene.sound.add(BACKGROUND_AUDIO_KEY, { loop: true });
        try {
            this.backgroundAudio.play();
            await Preferences.set({ key: PreferencesEnum.AUDIO_ON, value: 'true' });
        } catch (e) {
            console.error('Error playing background audio', e);
        }
    }

    /**
     * * Function to pause background audio file
     *
     */
    public async pauseBackground(): Promise<void> {
        if (this.backgroundAudio) {
            this.backgroundAudio.pause();
        } else {
            console.error('No backgroundAudio key was found');
        }
    }

    /**
     * * Function to resume the background audio file
     *
     */
    public async resumeBackground(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: PreferencesEnum.AUDIO_ON })).value;
        if (this.backgroundAudio && audioPreference === 'true') {
            this.backgroundAudio.resume();
            await Preferences.set({ key: PreferencesEnum.AUDIO_ON, value: 'true' });
        } else {
            console.error('No backgroundAudio key was found');
        }
    }

    /**
     * * Function to play jump audio
     *
     * @param scene as Scene
     */
    public playJump(scene: Scene): void {
        this.jumpAudio = scene.sound.add(JUMP_AUDIO_KEY, { loop: false });
        try {
            if (!this.jumpAudio.isPlaying) this.jumpAudio.play();
        } catch (e) {
            console.error('Error playing jump audio', e);
        }
    }
    /**
     * * Function to play damage audio this is similar as playFail but inside a phaser scene
     *
     * @param scene as Scene
     */
    public async playDamage(scene: Scene): Promise<void> {
        const effectsEnabled = (await Preferences.get({ key: 'EFFECTS_ON' })).value === 'true';
        this.damageAudio = scene.sound.add(GameEnum.LOSE, { loop: false });
        try {
            if (!this.damageAudio.isPlaying && effectsEnabled) this.damageAudio.play();
        } catch (e) {
            console.error('Error playing damageAudio audio', e);
        }
    }

    /**
     * * Function to play fail audio
     * * Since this is not an audio on the Phaser scene we don't use scene.add.sound, instead we use AudioElement from Angular
     *
     */
    public async playFail(): Promise<void> {
        void NativeAudio.play({
            assetId: GameEnum.LOSE,
            time: 0,
        });
    }
    /**
     * * Function to play damage audio this is similar as playSuccess but inside a phaser scene
     *
     * @param scene as Scene
     */
    public async playPowerUp(scene: Scene): Promise<void> {
        const effectsEnabled = (await Preferences.get({ key: 'EFFECTS_ON' })).value === 'true';
        this.powerUpAudio = scene.sound.add(GameEnum.WIN, { loop: false });
        try {
            if (!this.powerUpAudio.isPlaying && effectsEnabled) this.powerUpAudio.play();
        } catch (e) {
            console.error('Error playing powerUpAudio audio', e);
        }
    }
    /**
     * * Function to play success audio
     * * Since this is not an audio on the Phaser scene we don't use scene.add.sound, instead we use AudioElement from Angular
     *
     */
    public async playSuccess(): Promise<void> {
        void NativeAudio.play({
            assetId: GameEnum.WIN,
            time: 0,
        });
    }
}
