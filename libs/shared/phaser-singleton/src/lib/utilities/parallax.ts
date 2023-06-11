import { Scene } from 'phaser';

export const createAligned = (scene: Scene, totalWidth: number, texture: string, scrollFactor: number) => {
    const w = scene.textures.get(texture).getSourceImage().width;

    const count = Math.ceil(totalWidth / w) * scrollFactor;
    let x = 0;

    for (let i = 0; i < count; ++i) {
        const m = scene.add.image(x, scene.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor);
        x += m.width;
    }
};
