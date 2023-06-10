import { Scene } from 'phaser';

import { DAMAGED_ANIMATION, JUMPING_ANIMATION, WALKING_ANIMATION } from '../../constants/game-keys.constants';
import { DURATION_INVULNERABLE_REP, HEIGHT_OF_JUMP, INVULNERABLE_REPS, VELOCITY_PLAYER, VELOCITY_PLAYER_WHEN_MOVING } from '../../constants/game-units.constants';

export class Character {
    public name = 'character';
    public isInvulnerable: boolean = false; // Flag to detect gloves invulnerability
    public isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    public isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    public isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    public isDamaged: boolean = false; // * Flag to detect is character is being damaged
    public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used

    constructor() {
        try {
            //
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }

    /**
     * * Method that performs behaviors of char_sprite depending on flags
     *
     * @return void
     */
    public evaluateMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (this.isMovingLeft || cursors.left.isDown) {
            this.sprite.flipX = true;
            this.sprite.setVelocityX(-VELOCITY_PLAYER_WHEN_MOVING);
        } else if (this.isMovingRight || cursors.right.isDown) {
            this.sprite.flipX = false;
            this.sprite.setVelocityX(VELOCITY_PLAYER_WHEN_MOVING);
        } else if (this.isDamaged) {
            this.sprite.play(DAMAGED_ANIMATION);
        } else {
            if (this.sprite.body.touching.down) {
                this.sprite.setVelocityX(-VELOCITY_PLAYER);
                this.sprite.play(WALKING_ANIMATION, true);
            }
        }
        if (this.isJumping && this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-HEIGHT_OF_JUMP);
            this.sprite.setVelocityX(0);
            this.sprite.play(JUMPING_ANIMATION);
        }
    }

    /**
     * Method used to enable gloves
     *
     * @param worldObject gloves to be destroyed after used
     */
    public makeInvulnerable(scene: Scene): void {
        console.log('makeInvulnerable');
        this.isInvulnerable = true;
        scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration: DURATION_INVULNERABLE_REP, // Duration of each blinking
            repeat: INVULNERABLE_REPS, // Number of repetitions 200 x 10 = 2000millisec
            yoyo: true, // Type of animation
            onComplete: () => {
                this.sprite.setAlpha(1); // Restore normal opacity
                this.isInvulnerable = false;
            },
        });
    }
}
