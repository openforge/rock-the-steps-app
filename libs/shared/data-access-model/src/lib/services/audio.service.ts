import { Injectable } from '@angular/core';
import { Scene } from 'phaser';

import { BACKGROUND_AUDIO_KEY, JUMP_AUDIO_KEY } from '../constants/game-keys.constants';

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private backgroundAudio: Phaser.Sound.BaseSound; // * Property to store background audio actions
    private jumpAudio: Phaser.Sound.BaseSound; // * Property to store jump audio actions
    private failAudio = new Audio(); // * Property to store fail audio actions
    private successAudio = new Audio(); // * Property to store success audio actions
    public activeMusic = false; //* Property used to know if audio is on or off

    /**
     * * Function to start playing the background audio file
     *
     * @param scene as Phaser.Scene
     * @param backgroundKey as string
     */
    public playBackground(scene: Scene): void {
        this.activeMusic = true;
        this.backgroundAudio = scene.sound.add(BACKGROUND_AUDIO_KEY, { loop: true });
        try {
            this.backgroundAudio.play();
        } catch (e) {
            console.error('Error playing background audio', e);
        }
    }

    /**
     * * Function to pause background audio file
     *
     */
    public pauseBackground(): void {
        this.activeMusic = false;
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
    public resumeBackground(): void {
        if (this.backgroundAudio) {
            this.backgroundAudio.resume();
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
     * * Function to play fail audio
     * * Since this is not an audio on the Phaser scene we don't use scene.add.sound, instead we use AudioElement from Angular
     *
     */
    public async playFail(): Promise<void> {
        this.failAudio.src = 'assets/audios/fail/failure-drum-sound-effect-2-7184.mp3';
        this.failAudio.load();
        try {
            await this.failAudio.play();
        } catch (e) {
            console.error('Error playing fail audio', e);
        }
    }

    /**
     * * Function to play success audio
     * * Since this is not an audio on the Phaser scene we don't use scene.add.sound, instead we use AudioElement from Angular
     *
     */
    public async playSuccess(): Promise<void> {
        this.successAudio.src = 'assets/audios/winner/success-1-6297.mp3';
        this.successAudio.load();
        try {
            await this.successAudio.play();
        } catch (e) {
            console.error('Error playing success audio', e);
        }
    }
}
