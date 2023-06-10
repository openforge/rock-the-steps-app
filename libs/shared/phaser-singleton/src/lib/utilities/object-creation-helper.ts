import { HALF_DIVIDER, OBJECTS_SPRITE_KEY } from '@openforge/shared/data-access-model';
import { WorldObject } from 'libs/shared/data-access-model/src/lib/classes/obstacles/world-object.class';
import { Objects } from 'libs/shared/data-access-model/src/lib/enums/objects.enum';
import { Scene } from 'phaser';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createBell(worldObject: WorldObject, scene: Scene): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    console.log('Creating Bell');
    // Some random X of the width screen + 400 by the decreasing velocity
    const initialX = scene.sys.canvas.width + scene.sys.canvas.width / HALF_DIVIDER;
    const initialY = -scene.textures.get(Objects.BELL).getSourceImage().height;

    const worldObjectSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);
    return worldObjectSprite;
}
