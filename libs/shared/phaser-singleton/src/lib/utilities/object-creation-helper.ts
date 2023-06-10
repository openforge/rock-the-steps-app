import { OBJECTS_SPRITE_KEY, REPEAT_FRAME, TOURIST_END_FRAME, TOURIST_FRAME_KEY, TOURIST_FRAME_RATE, TOURIST_STANDING_FRAME, ZERO_PAD_TOURIST } from '@openforge/shared/data-access-model';
import { WorldObject } from 'libs/shared/data-access-model/src/lib/classes/obstacles/world-object.class';
import { Objects } from 'libs/shared/data-access-model/src/lib/enums/objects.enum';
import { Scene } from 'phaser';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createObjects(worldObject: WorldObject, scene: Scene, initialX: number, initialY: number, worldObjectGroup: Phaser.Physics.Arcade.Group) {
    console.log('createObjects:', worldObject.name);

    // If it's a BELL, Modify how it displays
    if (worldObject.name === Objects.BELL) {
        // TODO - Have bell fall from mid screen instead
        // initialX = scene.sys.canvas.width + scene.sys.canvas.width / HALF_DIVIDER;
    }

    // Here we set the Sprite Object, with or without modification for Bell
    const tmpSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);

    // * This is an obstacle!  Don't hit the tourists :)
    if (worldObject.name === Objects.TOURIST) {
        tmpSprite.anims.create({
            key: TOURIST_STANDING_FRAME,
            frames: scene.anims.generateFrameNames(OBJECTS_SPRITE_KEY, {
                prefix: TOURIST_FRAME_KEY,
                end: TOURIST_END_FRAME,
                zeroPad: ZERO_PAD_TOURIST,
            }),
            frameRate: TOURIST_FRAME_RATE,
            repeat: REPEAT_FRAME,
        });
        tmpSprite.anims.play(TOURIST_STANDING_FRAME, true);
    }
    tmpSprite.setName(worldObject.name);
    worldObjectGroup.add(tmpSprite);
}
