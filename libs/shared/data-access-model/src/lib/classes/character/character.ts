import { Scene } from 'phaser';
import * as Phaser from 'phaser';

import { CHARACTER_SPRITE_KEY, DAMAGED_ANIMATION, HEALTHBAR_KEY, HEALTHBAR_TEXTURE_PREFIX, JUMPING_ANIMATION, WALKING_ANIMATION } from '../../constants/game-keys.constants';
import {
    DAMAGE_TIMER,
    DURATION_INVULNERABLE_REP,
    HALF_DIVIDER,
    HEIGHT_OF_JUMP,
    INITIAL_HEALTHBAR_X,
    INITIAL_HEALTHBAR_Y,
    INVULNERABLE_REPS,
    PLAYER_POS_X,
    PLAYER_POS_Y,
    VELOCITY_PLAYER_WHEN_AUTOMATICALLY,
    VELOCITY_PLAYER_WHEN_MOVING,
} from '../../constants/game-units.constants';

export class Character {
    public name = 'character'; // * Character name
    public isInvulnerable: boolean = false; // * Flag to detect gloves invulnerability
    public isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    public isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    public isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    public isDamaged: boolean = false; // * Flag to detect is character is being damaged
    public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    public damageValue = 0; // * Amount of damaged received by obstacles
    public damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    public healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    constructor(scene: Scene, floorTileSprite: Phaser.GameObjects.TileSprite) {
        this.sprite = scene.physics.add.sprite(PLAYER_POS_X, PLAYER_POS_Y, CHARACTER_SPRITE_KEY);
        this.sprite.anims.play(WALKING_ANIMATION, true);
        this.sprite.setDepth(1);
        this.healthbar = scene.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.addFloorCollision(scene, floorTileSprite);
    }

    /**
     * * Adds collider with floor tile on the first setup, as well as dynamic floors after that.
     *
     * @param scene Scene
     * @param floorTileSprite Phaser.GameObjects.TileSprite
     */
    public addFloorCollision(scene: Scene, floorTileSprite: Phaser.GameObjects.TileSprite) {
        scene.physics.add.collider(this.sprite, floorTileSprite);
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
        }
        if (this.isDamaged) {
            this.sprite.play(DAMAGED_ANIMATION);
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
        // * If the character it's alreadt with the vulnerable mode then don't assign it again
        if (!this.isInvulnerable) {
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

    /**
     * * Function to automatically move the character
     * * This is to avoid to get the player going back when the forward arrow is not pressed
     *
     */
    public moveCharacterAutomatically(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (!this.isMovingRight && !this.isMovingLeft && this.sprite.body.touching.down && !cursors.left.isDown && !cursors.right.isDown) {
            this.sprite.setVelocityX(VELOCITY_PLAYER_WHEN_AUTOMATICALLY);
            this.sprite.play(WALKING_ANIMATION, true);
        }
    }

    /**
     * * Method to avoid player go outside scene
     *
     * @return void
     */
    public avoidOutOfBounds(): void {
        const personWidth = this.sprite.width;
        const xMin = personWidth / HALF_DIVIDER; // Left limit
        const xMax = window.innerWidth - personWidth / HALF_DIVIDER; // right limit
        this.sprite.x = Phaser.Math.Clamp(this.sprite.x, xMin, xMax);
    }

    /**
     * * Method used to heal up player
     *
     * @param worldObject cheesesteak to be destroyed after used
     * @param obstacleGroup
     */
    public healUp(worldObject: Phaser.Types.Physics.Arcade.GameObjectWithBody, obstacleGroup: Phaser.Physics.Arcade.Group): void {
        this.damageValue--;
        this.healthbar.setTexture(HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}${this.damageValue}`);
        worldObject.destroy(); //* If cheesesteak is picked up destroy the asset
        obstacleGroup.remove(worldObject);
    }

    /**
     * * Method used to receive damage to the user
     *
     * @return void
     */
    public receiveDamage(scene: Phaser.Scene): void {
        // If is not invulnerable then affect with damage
        this.damageValue++;
        this.sprite.setVelocityY(-VELOCITY_PLAYER_WHEN_MOVING);
        // Make invulnerable for some seconds to avoid multi coalition
        this.isInvulnerable = true;
        this.healthbar.setTexture(HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}${this.damageValue}`);
        // Set damaged flag so no other animations break damaged animation
        // Play damage animation
        this.isDamaged = true;
        // Stop and Delete previous same timer (IF EXISTS)
        if (this.damageTimer) {
            this.damageTimer.destroy();
        }
        //INITS the damage timer with a duration of 2sec (2000 ms)
        this.damageTimer = scene.time.addEvent({
            delay: DAMAGE_TIMER,
            callback: () => {
                this.sprite.setVelocityY(0);
                this.isDamaged = false;
                this.isInvulnerable = false;
            },
            callbackScope: this,
            loop: false,
        });
    }
}
