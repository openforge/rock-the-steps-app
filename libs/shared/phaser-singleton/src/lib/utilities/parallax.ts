import { MOVING_X_BACKGROUNDS } from '@openforge/shared/data-access-model';
import { Scene } from 'phaser';

/**
 *
 * @param scene Scene
 * @param totalWidth number
 * @param texture string
 * @param scrollFactor number
 */
export const createAligned = (scene: Scene, totalWidth: number, texture: string, scrollFactor: number) => {
    const w = scene.textures.get(texture).getSourceImage().width;

    const count = Math.ceil(totalWidth / w) * scrollFactor;
    let x = 0;

    for (let i = 0; i < count; ++i) {
        const tmpImage = scene.add.tileSprite(x, scene.scale.height, totalWidth, scene.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor);
        x += tmpImage.width;
        tmpImage.tilePositionX += MOVING_X_BACKGROUNDS;
    }
};
