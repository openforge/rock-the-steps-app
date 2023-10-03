import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'openforge-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
    public musicEnabled = false; //* prop used in the html use to track if music is enabled
    public effectsEnabled = false; //* prop used in the html use to track if effects  is enabled
    constructor(private modalService: ModalService) {}

    async ngOnInit() {
        this.musicEnabled = (await Preferences.get({ key: 'AUDIO_ON' })).value === 'true';
        this.effectsEnabled = (await Preferences.get({ key: 'EFFECTS_ON' })).value === 'true';
    }

    public async dismissModal(): Promise<void> {
        await this.modalService.dismiss();
    }
    public async toggleMusic(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'AUDIO_ON' })).value;
        if (audioPreference === 'true') {
            await Preferences.set({ key: 'AUDIO_ON', value: 'false' });
            this.musicEnabled = false;
        } else {
            await Preferences.set({ key: 'AUDIO_ON', value: 'true' });
            this.musicEnabled = true;
        }
    }

    public async toggleEffects(): Promise<void> {
        const audioPreference = (await Preferences.get({ key: 'EFFECTS_ON' })).value;
        if (audioPreference === 'true') {
            await Preferences.set({ key: 'EFFECTS_ON', value: 'false' });
            this.effectsEnabled = false;
        } else {
            await Preferences.set({ key: 'EFFECTS_ON', value: 'true' });
            this.effectsEnabled = true;
        }
    }
}
