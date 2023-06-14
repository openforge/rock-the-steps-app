import { Scene } from 'phaser';

type scaleMode = 'FIT' | 'SMOOTH';

const DEFAULT_WIDTH: number = 1024;
const DEFAULT_HEIGHT: number = 576;
const MAX_WIDTH: number = 1536;
const MAX_HEIGHT: number = 864;
const SCALE_MODE: scaleMode = 'SMOOTH'; // FIT OR SMOOTH

/**
 * Manual Resize logic originally credited to yandeu under MIT
 * https://github.com/yandeu/phaser3-scaling-resizing-example/blob/master/src/scripts/game.ts
 * Copyright (c) 2019 Yannick Deubel (https://github.com/yandeu)
 *
 * @param scene: Scene
 */
export const manualResize = (scene: Scene) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const width = DEFAULT_WIDTH;
    const height = DEFAULT_HEIGHT;
    const maxWidth = MAX_WIDTH;
    const maxHeight = MAX_HEIGHT;
    const scaleMode = SCALE_MODE;

    const scale = Math.min(w / width, h / height);
    const newWidth = Math.min(w / scale, maxWidth);
    const newHeight = Math.min(h / scale, maxHeight);

    const defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    const maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    const maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;

    // smooth scaling
    let smooth = 1;
    if (scaleMode === 'SMOOTH') {
        const maxSmoothScale = 1.15;
        const normalize = (value: number, min: number, max: number) => (value - min) / (max - min);
        if (width / height < w / h) {
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
        } else {
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
        }
    }

    // resize the game
    scene.game.scale.resize(newWidth * smooth, newHeight * smooth);

    // scale the width and height of the css
    scene.game.canvas.style.width = newWidth * scale + 'px';
    scene.game.canvas.style.height = newHeight * scale + 'px';

    // center the game with css margin
    scene.game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    scene.game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
};
