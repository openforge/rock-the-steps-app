import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private backgroundAudio: Phaser.Sound.BaseSound; // * Property to store background audio actions

    /**
     * * Function to start playing the background audio file
     *
     * @param scene as Phaser.Scene
     * @param backgroundKey as string
     */
    public playBackground(scene: Phaser.Scene, backgroundKey: string): void {
        this.backgroundAudio = scene.sound.add(backgroundKey, { loop: true });
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
}
