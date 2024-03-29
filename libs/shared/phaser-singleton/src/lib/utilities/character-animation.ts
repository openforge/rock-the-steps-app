import {
    AURA_GLOVES_KEY,
    AURA_MOON_KEY,
    AURA_RED_SPRITE,
    AURA_SPRITE_KEY,
    AURA_WHITE_SPRITE,
    CHARACTER_SPRITE_KEY,
    DAMAGE_PREFIX,
    DAMAGED_ANIMATION,
    END_FRAME_WALK,
    FRAME_RATE_DAMAGE,
    FRAME_RATE_JUMP,
    FRAME_RATE_WALK,
    JUMP_PREFIX,
    JUMPING_ANIMATION,
    REPEAT_FRAME,
    WALK_PREFIX,
    WALKING_ANIMATION,
    ZERO_PAD_PLAYER,
} from '@openforge/shared/data-access-model';

/**
 * Method used to generate the animations of the player
 *
 * @return void
 */
export function createAnimationsCharacter(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, scene: Phaser.Scene) {
    scene.anims.create({
        key: AURA_MOON_KEY,
        frames: scene.anims.generateFrameNames(AURA_SPRITE_KEY, {
            prefix: AURA_WHITE_SPRITE,
            end: 1,
            zeroPad: 3,
        }),
        frameRate: 4,
        repeat: REPEAT_FRAME,
    });
    scene.anims.create({
        key: AURA_GLOVES_KEY,
        frames: scene.anims.generateFrameNames(AURA_SPRITE_KEY, {
            prefix: AURA_RED_SPRITE,
            end: 1,
            zeroPad: 3,
        }),
        frameRate: 4,
        repeat: REPEAT_FRAME,
    });
    player.anims.create({
        key: WALKING_ANIMATION,
        frames: player.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
            prefix: WALK_PREFIX,
            end: END_FRAME_WALK,
            zeroPad: ZERO_PAD_PLAYER,
        }),
        frameRate: FRAME_RATE_WALK,
        repeat: REPEAT_FRAME,
    });
    player.anims.create({
        key: JUMPING_ANIMATION,
        frames: player.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
            prefix: JUMP_PREFIX,
            end: 0,
            zeroPad: ZERO_PAD_PLAYER,
        }),
        frameRate: FRAME_RATE_JUMP,
        repeat: 0,
    });
    player.anims.create({
        key: DAMAGED_ANIMATION,
        frames: player.anims.generateFrameNames(CHARACTER_SPRITE_KEY, {
            prefix: DAMAGE_PREFIX,
            end: 0,
            zeroPad: ZERO_PAD_PLAYER,
        }),
        frameRate: FRAME_RATE_DAMAGE,
        repeat: REPEAT_FRAME,
    });
}
