import { Injectable } from '@angular/core';
import { Scene } from 'phaser';

import { BACKGROUND_AUDIO_KEY, JUMP_AUDIO_KEY } from '../constants/game-keys.constants';

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private backgroundAudio: Phaser.Sound.BaseSound; // * Property to store background audio actions
    private jumpAudio: Phaser.Sound.BaseSound; // * Property to store jump audio actions

    /**
     * * Function to start playing the background audio file
     *
     * @param scene as Phaser.Scene
     * @param backgroundKey as string
     */
    public playBackground(scene: Scene): void {
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
            console.error('Error playing background audio', e);
        }
    }
}
