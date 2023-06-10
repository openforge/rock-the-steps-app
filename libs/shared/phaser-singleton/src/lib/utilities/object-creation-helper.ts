import {
    HALF_DIVIDER,
    OBJECTS_SPRITE_KEY,
    REPEAT_FRAME,
    TORUIST_END_FRAME,
    TORUIST_FRAME_KEY,
    TORUIST_FRAME_RATE,
    TOURIST_STANDING_FRAME,
    ZERO_PAD_TOURIST,
} from '@openforge/shared/data-access-model';
import { WorldObject } from 'libs/shared/data-access-model/src/lib/classes/obstacles/world-object.class';
import { Objects } from 'libs/shared/data-access-model/src/lib/enums/objects.enum';
import { Scene } from 'phaser';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createObjects(worldObject: WorldObject, scene: Scene, initialX: number, initialY: number, worldObjectGroup: Phaser.Physics.Arcade.Group) {
    console.log('createObjects:', worldObject.name);

    // If it's a BELL, Modify how it displays
    if (worldObject.name === Objects.BELL) {
        initialX = scene.sys.canvas.width + scene.sys.canvas.width / HALF_DIVIDER;
        initialY = -scene.textures.get(Objects.BELL).getSourceImage().height;
    }

    // Here we set the Sprite Object, with or without modification for Bell
    const worldObjectSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);

    // * This is an obstacle!  Don't hit the tourists :)
    if (worldObject.name === Objects.TOURIST) {
        worldObjectSprite.anims.create({
            key: TOURIST_STANDING_FRAME,
            frames: scene.anims.generateFrameNames(OBJECTS_SPRITE_KEY, {
                prefix: TORUIST_FRAME_KEY,
                end: TORUIST_END_FRAME,
                zeroPad: ZERO_PAD_TOURIST,
            }),
            frameRate: TORUIST_FRAME_RATE,
            repeat: REPEAT_FRAME,
        });
        worldObjectSprite.anims.play(TOURIST_STANDING_FRAME, true);
    }
    worldObjectSprite.setName(worldObject.name);
    worldObjectGroup.add(worldObjectSprite);
}
