import {
    END_KEY,
    END_OBJECT_SCALE,
    FLYER_PIGEONS_Y_OFFSET,
    GameEngineSingleton,
    OBJECTS_SPRITE_KEY,
    Pigeon,
    PIGEON_END_FRAME,
    PIGEON_FRAME_KEY,
    PIGEON_FRAME_RATE,
    PIGEON_START_FRAME,
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
    tmpSprite.body.setGravityY(POOP_OBJECTS_VELOCITY_Y);
    return tmpSprite;
}

/**
 * Method used to generate pigeons
 *
 * @param scene
 * @param pigeon
 * @param initialX
 * @param initialY
 */
export function createPigeonObjectSprite(scene: Phaser.Scene, pigeon: Pigeon, initialX: number, initialY: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    let positionY = initialY;
    const isFlying = Math.floor(2 * Math.random()) === 0;
    pigeon.isFlying = isFlying;
    // If is a pigeon it can be already flying or start flying from floor
    // Pigeon variant 0 will fly from floor
    // Pigeon variant 1 will be already flying
    if (isFlying) {
        positionY = window.innerHeight * FLYER_PIGEONS_Y_OFFSET; // This will be the Y axis of pigeon flying
    }
    const tmpSprite = scene.physics.add.sprite(initialX, positionY, OBJECTS_SPRITE_KEY, pigeon.name);
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
export function createObjects(worldObject: WorldObject, scene: Phaser.Scene, initialX: number, initialY: number, obstacleGroup: Phaser.Physics.Arcade.Group) {
    // * If it's a BELL, Modify how it displays
    if (worldObject.name === Objects.BELL) {
        // TODO - Have bell fall from mid screen instead
        // initialX = scene.sys.canvas.width + scene.sys.canvas.width / HALF_DIVIDER;
    }

    // * Here we set the Sprite Object, with or without modification for Bell
    const tmpSprite = scene.physics.add.sprite(initialX, initialY, OBJECTS_SPRITE_KEY, worldObject.name);

    // * This is an obstacle!  Don't hit the tourists :)
    if (worldObject.name === Objects.TOURIST) {
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
    tmpSprite.setName(worldObject.name);
    obstacleGroup.add(tmpSprite);
}

/**
 * Method used to draw the end museum if the end has being reached
 */
export function drawEndMuseum(scene: Phaser.Scene, isEndReached: boolean, obstacleGroup: Phaser.Physics.Arcade.Group): void {
    const x = scene.sys.canvas.width;
    const y = 0;
    // Draw the museum if the goal points has been reached
    if (GameEngineSingleton.points > GameEngineSingleton.world.pointsToEndLevel && !isEndReached) {
        const tmpObject = scene.physics.add.image(x, y, END_KEY);
        tmpObject.setName(END_KEY);
        tmpObject.setScale(END_OBJECT_SCALE);
        obstacleGroup.add(tmpObject);
        isEndReached = true;
    }
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
