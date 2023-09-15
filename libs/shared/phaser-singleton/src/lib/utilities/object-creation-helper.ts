/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
    Character,
    FLOOR_KEY,
    FLYER_PIGEONS_Y_OFFSET,
    OBJECTS_SPRITE_KEY,
    Pigeon,
    PIGEON_END_FRAME,
    PIGEON_FRAME_KEY,
    PIGEON_FRAME_RATE,
    PIGEON_START_FRAME,
    POOP_OBJECTS_VELOCITY_Y,
    REPEAT_FRAME,
    STANDING_FRAME,
    STEPS_KEY,
    TOURIST_END_FRAME,
    TOURIST_FRAME_KEY,
    TOURIST_FRAME_RATE,
    WORLD_OBJECTS_VELOCITY,
    ZERO_PAD_PIGEON,
    ZERO_PAD_TOURIST,
} from '@openforge/shared/data-access-model';
import { WorldObject } from 'libs/shared/data-access-model/src/lib/classes/obstacles/world-object.class';
import { Objects } from 'libs/shared/data-access-model/src/lib/enums/objects.enum';
import { Scene } from 'phaser';

/**
 * Method used to generate dropable objects
 *
 * @param scene
 * @param initialX
 * @param initialY
 * @param objectName
 */
export function createDropObject(scene: Scene, initialX: number, initialY: number, objectName: string): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
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
export function createPigeonObjectSprite(scene: Scene, pigeon: Pigeon, initialX: number, initialY: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
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
export function createObjects(worldObject: WorldObject, scene: Scene, initialX: number, initialY: number, obstacleGroup: Phaser.Physics.Arcade.Group) {
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
 * TODO - IMPLEMENT THE STEPS AND PLAYER RUNNING ABOVE IT
 */
export function createSteps(scene: Scene, initialX: number, initialY: number, obstacleGroup: Phaser.Physics.Arcade.Group, character: Character) {
    console.log('create steps', initialX, initialY);

    // First, add the steps
    const tmpSteps = scene.physics.add.image(initialX - 100, initialY, STEPS_KEY);
    tmpSteps.setName(STEPS_KEY);
    tmpSteps.body.setImmovable(true);
    tmpSteps.setImmovable(true);
    obstacleGroup.add(tmpSteps);

    scene.physics.add.collider(character.sprite, tmpSteps, (tmpChar, tmpStepsCB) => {
        console.log('Collision #1' + tmpChar.name + ' XXX ' + tmpStepsCB.name);
    });

    // * Always shift it by X + width of the steps so they dont overlap
    const tmpFloor = scene.physics.add.image(initialX + tmpSteps.width, initialY, FLOOR_KEY);
    tmpFloor.setName(FLOOR_KEY);
    tmpFloor.body.setImmovable(true);
    tmpFloor.setImmovable(true);
    obstacleGroup.add(tmpFloor);
    scene.physics.add.collider(tmpFloor, obstacleGroup); // * Collide with obstacleGroup

    scene.physics.add.collider(character.sprite, tmpFloor, (tmpCharSprite, floorSprite) => {
        console.log('Collision #2' + tmpCharSprite.name + ' XXX ' + floorSprite.name);
    });
}
