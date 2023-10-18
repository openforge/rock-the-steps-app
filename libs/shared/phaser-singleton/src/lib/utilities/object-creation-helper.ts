import {
    FLYER_PIGEONS_Y_OFFSET,
    OBJECTS_SPRITE_KEY,
    Pigeon,
    PIGEON_END_FRAME,
    PIGEON_FRAME_KEY,
    PIGEON_FRAME_RATE,
    PIGEON_START_FRAME,
    POOP_GRAVITY,
    POOP_OBJECTS_VELOCITY_Y,
    REPEAT_FRAME,
    STANDING_FRAME,
    TOURIST_END_FRAME,
    TOURIST_FRAME_KEY,
    TOURIST_FRAME_RATE,
    WORLD_OBJECTS_VELOCITY,
    ZERO_PAD_PIGEON,
    ZERO_PAD_TOURIST,
} from '@openforge/shared/data-access-model';
import { CONFIG } from '@openforge/shared-phaser-singleton';
import { WorldObject } from 'libs/shared/data-access-model/src/lib/classes/obstacles/world-object.class';
import { Objects } from 'libs/shared/data-access-model/src/lib/enums/objects.enum';
import * as Phaser from 'phaser';

/**
 * Method used to generate dropable objects
 *
 * @param scene
 * @param initialX
 * @param initialY
 * @param objectName
 */
export function createDropObject(scene: Phaser.Scene, initialX: number, initialY: number, objectName: string): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const tmpSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, objectName);
    tmpSprite.setName(objectName);
    tmpSprite.setVelocityX(-WORLD_OBJECTS_VELOCITY);
    tmpSprite.setVelocityY(POOP_OBJECTS_VELOCITY_Y);
    tmpSprite.setGravityY(POOP_GRAVITY);
    return tmpSprite;
}

/**
 * Method used to generate pigeons
 *
 * @param scene
 * @param pigeon
 * @param initialX
 * @param initialY
 * @param floorNumber
 * @param floorHeight
 */
export function createPigeonObjectSprite(
    scene: Phaser.Scene,
    pigeon: Pigeon,
    initialX: number,
    initialY: number,
    floorNumber: number,
    floorHeight: number
): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    let positionY = initialY;
    const isFlying = false;
    pigeon.isFlying = isFlying;
    // If is a pigeon it can be already flying or start flying from floor
    // Pigeon variant 0 will fly from floor
    // Pigeon variant 1 will be already flying
    if (isFlying) {
        positionY = window.innerHeight * FLYER_PIGEONS_Y_OFFSET; // This will be the Y axis of pigeon flying
    }
    const tmpSprite = scene.physics.add.sprite(initialX, positionY, OBJECTS_SPRITE_KEY, pigeon.name);
    if (!isFlying) {
        const positionYCalculated = floorHeight * floorNumber;
        tmpSprite.setOrigin(0);
        tmpSprite.body.setImmovable(true);
        tmpSprite.setImmovable(true);
        tmpSprite.setPosition(initialX, CONFIG.DEFAULT_HEIGHT - positionYCalculated - tmpSprite.displayHeight);
    }
    tmpSprite.setVelocityX(-WORLD_OBJECTS_VELOCITY);
    tmpSprite.anims.create({
        key: STANDING_FRAME,
        frames: scene.anims.generateFrameNames(OBJECTS_SPRITE_KEY, {
            prefix: PIGEON_FRAME_KEY,
            start: PIGEON_START_FRAME,
            end: PIGEON_END_FRAME,
            zeroPad: ZERO_PAD_PIGEON,
        }),
        frameRate: PIGEON_FRAME_RATE,
        repeat: REPEAT_FRAME,
    });
    return tmpSprite;
}
export function createObjects(worldObject: WorldObject, scene: Phaser.Scene, initialX: number, initialY: number, obstacleGroup: Phaser.Physics.Arcade.Group, floorNumber: number, floorHeight: number) {
    // * If it's a BELL, Modify how it displays
    if (worldObject.name === Objects.BELL) {
        // TODO - Have bell fall from mid screen instead
        // initialX = scene.sys.canvas.width + scene.sys.canvas.width / HALF_DIVIDER;
    }
    let tmpSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    if (worldObject.name === Objects.MOON) {
        tmpSprite = scene.physics.add.image(initialX, initialY, worldObject.name);
    } else {
        // * Here we set the Sprite Object, with or without modification for Bell
        tmpSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);
    }

    if (worldObject.name === Objects.TOURIST && tmpSprite instanceof Phaser.Physics.Arcade.Sprite) {
        // * This is an obstacle!  Don't hit the tourists :)
        tmpSprite.anims.create({
            key: STANDING_FRAME,
            frames: scene.anims.generateFrameNames(OBJECTS_SPRITE_KEY, {
                prefix: TOURIST_FRAME_KEY,
                end: TOURIST_END_FRAME,
                zeroPad: ZERO_PAD_TOURIST,
            }),
            frameRate: TOURIST_FRAME_RATE,
            repeat: REPEAT_FRAME,
        });
        tmpSprite.anims.play(STANDING_FRAME, true);
    }
    const positionY = floorHeight * floorNumber;
    tmpSprite.setDepth(2);
    tmpSprite.setOrigin(0);
    tmpSprite.body.setImmovable(true);
    tmpSprite.setImmovable(true);
    tmpSprite.setPosition(initialX, CONFIG.DEFAULT_HEIGHT - positionY - tmpSprite.displayHeight);
    tmpSprite.setName(worldObject.name);
    obstacleGroup.add(tmpSprite);
}

/**
 * * Method used to remove obstacles after off screened
 *
 * @return void
 */
export function cleanUpObjects(obstacleGroup: Phaser.Physics.Arcade.Group, obstaclePigeonGroup: Pigeon[]): void {
    obstacleGroup.children.iterate((worldObject: Phaser.GameObjects.Image) => {
        if (worldObject && worldObject.x + worldObject.width < 0 - worldObject.width) {
            worldObject.destroy();
            obstacleGroup.remove(worldObject);
        }
    });

    obstaclePigeonGroup.map((worldObject: Pigeon, index) => {
        if (worldObject && worldObject.sprite.x + worldObject.sprite.width < 0 - worldObject.sprite.width) {
            worldObject.sprite.destroy();
        } else if (worldObject && worldObject.sprite.y + worldObject.sprite.height > window.innerHeight + worldObject.sprite.height) {
            worldObject.sprite.destroy();
            obstaclePigeonGroup.splice(index, 1);
        }
    });
}
