import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PreferencesEnum } from '@openforge/shared/data-access-model';

import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'openforge-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
    public musicEnabled = false; //* prop used in the html use to track if music is enabled
    public effectsEnabled = false; //* prop used in the html use to track if effects  is enabled
    public currentScorePoints = '';

    constructor(private modalService: ModalService) {}

    /**
     * Implementation of OnInit to setup the sound flag according user selection
     */
    async ngOnInit() {
        this.musicEnabled = (await Preferences.get({ key: PreferencesEnum.AUDIO_ON })).value === 'true';
        this.effectsEnabled = (await Preferences.get({ key: PreferencesEnum.EFFECTS_ON })).value === 'true';
        this.currentScorePoints = (await Preferences.get({ key: PreferencesEnum.TOTAL_POINTS })).value;
    }

    /**
     * Method used to close the modal and continue on stage selection
     */
    public async dismissModal(): Promise<void> {
        await this.modalService.dismiss();
    }

    /**
     * Method used to toggle either music or effects of the game
     */
    public async toggleMusic(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: PreferencesEnum.AUDIO_ON })).value;
        if (audioPreference === 'true') {
            await Preferences.set({ key: PreferencesEnum.AUDIO_ON, value: 'false' });
            this.musicEnabled = false;
        } else {
            await Preferences.set({ key: PreferencesEnum.AUDIO_ON, value: 'true' });
            this.musicEnabled = true;
        }
    }

    public async toggleEffects(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: PreferencesEnum.EFFECTS_ON })).value;
        if (audioPreference === 'true') {
            await Preferences.set({ key: PreferencesEnum.EFFECTS_ON, value: 'false' });
            this.effectsEnabled = false;
        } else {
            await Preferences.set({ key: PreferencesEnum.EFFECTS_ON, value: 'true' });
            this.effectsEnabled = true;
        }
    }

    /**
     * * Function to clear total points
     */
    public async clearScorePoints(): Promise<void> {
        await Preferences.set({ key: PreferencesEnum.TOTAL_POINTS, value: '0' });
        this.currentScorePoints = (await Preferences.get({ key: PreferencesEnum.TOTAL_POINTS })).value;
    }
}
