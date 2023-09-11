/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
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
export function createAnimationsCharacter(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
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
        repeat: 0,
    });
}
