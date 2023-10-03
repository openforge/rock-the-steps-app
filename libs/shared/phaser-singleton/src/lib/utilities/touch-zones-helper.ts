/* eslint-disable no-magic-numbers */
import { GameEngineSingleton, ZoneType } from '@openforge/shared/data-access-model';
import { CONFIG } from '@openforge/shared-phaser-singleton';

import { WorldScene } from '../scenes/world.scene';

/**
 * * Function to create the touch zones in the screen
 *
 * @param scene as WorldScene
 */
export function createTouchZones(scene: WorldScene): void {
    console.log('world.scene.ts', 'createZones');
    const zoneLeftX = 100;
    const zoneWidth = (CONFIG.DEFAULT_WIDTH * 20) / 100;
    const zoneRightX = 300;
    const zoneHeight = 200;
    const zoneJumpX = CONFIG.DEFAULT_WIDTH - zoneWidth * 0.5;
    const zoneY = CONFIG.DEFAULT_HEIGHT - zoneHeight * 0.3;

    // * Creating touch zone for the right side
    const zoneRight = scene.add.zone(zoneRightX, zoneY, zoneWidth, zoneHeight);
    zoneRight.setInteractive();
    zoneRight.on('pointerdown', () => zoneClicked(ZoneType.MOVE_RIGHT, true, scene));
    zoneRight.on('pointerup', () => zoneClicked(ZoneType.MOVE_RIGHT, false, scene));

    // * Creating touch zone for the left side
    const zoneLeft = scene.add.zone(zoneLeftX, zoneY, zoneWidth, zoneHeight);
    zoneLeft.setInteractive();
    zoneLeft.on('pointerdown', () => zoneClicked(ZoneType.MOVE_LEFT, true, scene));
    zoneLeft.on('pointerup', () => zoneClicked(ZoneType.MOVE_LEFT, false, scene));

    const zoneJump = scene.add.zone(zoneJumpX, zoneY, zoneWidth, zoneHeight);
    zoneJump.setInteractive();
    zoneJump.on('pointerdown', () => zoneClicked(ZoneType.JUMP, true, scene));
    zoneJump.on('pointerup', () => zoneClicked(ZoneType.JUMP, false, scene));
}

/**
 * * Function that handle touch zone actions
 *
 * @param zoneType as ZoneType
 * @param action as the action to set
 * @param scene as WorldScene
 */
function zoneClicked(zoneType: ZoneType, action: boolean, scene: WorldScene) {
    switch (zoneType) {
        case ZoneType.JUMP:
            scene.character.isJumping = action;
            if (GameEngineSingleton.audioService.activeMusic && action) {
                GameEngineSingleton.audioService.playJump(scene);
            }
            break;
        case ZoneType.MOVE_LEFT:
            scene.character.isMovingLeft = action;
            break;
        case ZoneType.MOVE_RIGHT:
            scene.character.isMovingRight = action;
            break;
    }
}
