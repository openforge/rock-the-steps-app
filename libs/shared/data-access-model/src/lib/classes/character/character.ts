import { Scene } from 'phaser';
import * as Phaser from 'phaser';

import {
    AURA_GLOVES_KEY,
    AURA_MOON_KEY,
    AURA_SPRITE_KEY,
    CHARACTER_SPRITE_KEY,
    DAMAGED_ANIMATION,
    HEALTHBAR_KEY,
    HEALTHBAR_TEXTURE_PREFIX,
    JUMPING_ANIMATION,
    WALKING_ANIMATION,
} from '../../constants/game-keys.constants';
import {
    DAMAGE_TIMER,
    DURATION_INVULNERABLE_TIME,
    HALF_DIVIDER,
    HEIGHT_OF_JUMP,
    HEIGHT_OF_MOON_JUMP,
    INITIAL_HEALTHBAR_X,
    INITIAL_HEALTHBAR_Y,
    MOON_GRAVITY,
    MOONSHOES_TIMER,
    NORMAL_GRAVITY,
    ORIGIN_CHARACTER_TEXT,
    PLAYER_POS_X,
    PLAYER_POS_Y,
    SMALL_JUMP_ON_DAMAGE,
    TEXT_CHARACTER_OFFSET,
    TIMEOUT_TEXT_CHARACTER,
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
    public hasMoonShoes: boolean = false; // * Flag to detect is character has moon shoes
    public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Player to be used
    public damageValue = 0; // * Amount of damaged received by obstacles
    public damageTimer: Phaser.Time.TimerEvent; // * Timer used to play damage animation for a small time
    public glovesTimer: Phaser.Time.TimerEvent; // * Timer used to play gloves animation for a small time
    public moonShoesTimer: Phaser.Time.TimerEvent; // * Timer used to play gloves animation for a small time
    public healthbar: Phaser.GameObjects.Sprite; // * Healthbar used to show the remaining life of the player
    public auraGloves: Phaser.GameObjects.Sprite; //* Sprite used as animation to show that power ups are active
    public auraMoonShoes: Phaser.GameObjects.Sprite; //* Sprite used as animation to show that power ups are active
    public glovesRemainingTime = 0; // Prop used to measure gloves remaining time
    public moonShoesRemainingTime = 0; // Prop used to measure moon shoes remaining time
    constructor(scene: Scene, floorTileSprite: Phaser.GameObjects.TileSprite | Phaser.Physics.Arcade.Sprite) {
        this.sprite = scene.physics.add.sprite(PLAYER_POS_X, PLAYER_POS_Y, CHARACTER_SPRITE_KEY);
        this.sprite.setGravityY(NORMAL_GRAVITY);
        this.sprite.anims.play(WALKING_ANIMATION, true);
        this.sprite.setDepth(2);
        this.sprite.body.bounce.y = 0;
        this.sprite.setCollideWorldBounds(true, 0, 0);
        this.healthbar = scene.add.sprite(INITIAL_HEALTHBAR_X, INITIAL_HEALTHBAR_Y, HEALTHBAR_KEY, `${HEALTHBAR_TEXTURE_PREFIX}0`);
        this.addFloorCollision(scene, floorTileSprite);
    }

    /**
     * Method used to display the aura for moon shoes!
     *
     * @param scene
     */
    public showMoonPowerUpAnimation(scene: Phaser.Scene): void {
        if (this.hasMoonShoes && !this.auraMoonShoes) {
            this.auraMoonShoes = scene.add.sprite(this.sprite.x, this.sprite.y, AURA_SPRITE_KEY, AURA_MOON_KEY);
            // eslint-disable-next-line no-magic-numbers
            this.auraMoonShoes.setOrigin(0.5, 0.7);
            this.auraMoonShoes.setScale(2);
            this.auraMoonShoes.setDepth(0);
            this.auraMoonShoes.play(AURA_MOON_KEY, true);
        } else if (this.hasMoonShoes && this.auraMoonShoes.active) {
            this.auraMoonShoes.x = this.sprite.x;
            this.auraMoonShoes.y = this.sprite.y;
        } else if (!this.hasMoonShoes && this.auraMoonShoes && this.auraMoonShoes.active) {
            this.auraMoonShoes.destroy();
            this.auraMoonShoes = undefined;
        }
    }
    /**
     * Method used to display the aura for Gloves power up!
     *
     * @param scene
     */
    public showGlovesPowerUpAnimation(scene: Phaser.Scene): void {
        if (this.isInvulnerable && !this.auraGloves) {
            this.auraGloves = scene.add.sprite(this.sprite.x, this.sprite.y, AURA_SPRITE_KEY, AURA_GLOVES_KEY);
            // eslint-disable-next-line no-magic-numbers
            this.auraGloves.setOrigin(0.5, 0.7);
            this.auraGloves.setScale(2);
            this.auraGloves.setDepth(0);
            this.auraGloves.play(AURA_GLOVES_KEY, true);
        } else if (this.isInvulnerable && this.auraGloves.active) {
            this.auraGloves.x = this.sprite.x;
            this.auraGloves.y = this.sprite.y;
        } else if (!this.isInvulnerable && this.auraGloves && this.auraGloves.active) {
            this.auraGloves.destroy();
            this.auraGloves = undefined;
        }
    }
    /**
     * * Adds collider with floor tile on the first setup, as well as dynamic floors after that.
     *
     * @param scene Scene
     * @param floorTileSprite Phaser.GameObjects.TileSprite
     */
    public addFloorCollision(scene: Scene, floorTileSprite: Phaser.GameObjects.TileSprite | Phaser.Physics.Arcade.Sprite) {
        scene.physics.add.collider(this.sprite, floorTileSprite);
    }
    /**
     * Method used to add moon shoes to the player so he can jump higher and smoother
     *
     * @param scene
     */
    public addMoonShoes(scene: Scene): void {
        if (this.moonShoesTimer) {
            this.moonShoesRemainingTime += DURATION_INVULNERABLE_TIME;
            this.moonShoesTimer.destroy();
        } else {
            this.moonShoesRemainingTime = DURATION_INVULNERABLE_TIME;
        }
        this.startTimerMoonShoes(scene);
    }
    /**
     * Method used to run timer for moonshoes so the player will jump higher and smoother for X time
     *
     * @param scene
     */
    public startTimerMoonShoes(scene: Phaser.Scene): void {
        this.hasMoonShoes = true;
        this.sprite.setGravityY(MOON_GRAVITY);
        this.moonShoesTimer = scene.time.addEvent({
            delay: MOONSHOES_TIMER,
            callback: () => {
                this.hasMoonShoes = false;
                this.sprite.setGravityY(NORMAL_GRAVITY);
            },
            callbackScope: this,
            loop: false,
        });
    }
    /**
     * Method used to enable gloves
     *
     * @param worldObject gloves to be destroyed after used
     */
    public makeInvulnerable(scene: Scene): void {
        if (this.glovesTimer) {
            this.glovesRemainingTime += DURATION_INVULNERABLE_TIME;
            this.glovesTimer.destroy();
        } else {
            this.glovesRemainingTime = DURATION_INVULNERABLE_TIME;
        }
        this.startTimerInvulnerable(scene);
    }

    /**
     * Method used to run timer for gloves so the player will jump higher and smoother for X time
     *
     * @param scene
     */
    public startTimerInvulnerable(scene: Scene): void {
        this.isInvulnerable = true;
        this.glovesTimer = scene.time.addEvent({
            delay: this.glovesRemainingTime, // Duration of each blinking
            callback: () => {
                this.isInvulnerable = false;
            },
        });
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
            if (this.hasMoonShoes) {
                this.sprite.setVelocityY(-HEIGHT_OF_MOON_JUMP);
            } else {
                this.sprite.setVelocityY(-HEIGHT_OF_JUMP);
            }
            this.sprite.setVelocityX(0);
            this.sprite.play(JUMPING_ANIMATION);
        }
    }
    showTextAbove(scene: Phaser.Scene, color: string, text: string) {
        const textoDanio = scene.add
            .text(this.sprite.x, this.sprite.y - TEXT_CHARACTER_OFFSET, text, {
                fontFamily: 'Arial',
                fontSize: '20px',
                strokeThickness: 3,
                stroke: '#000000',
                color, // Color rojo
            })
            .setOrigin(ORIGIN_CHARACTER_TEXT);

        scene.time.delayedCall(TIMEOUT_TEXT_CHARACTER, () => {
            textoDanio.destroy();
        });
    }

    /**
     * * Function to automatically move the character
     * * This is to avoid to get the player going back when the forward arrow is not pressed
     *
     */
    public moveCharacterAutomatically(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (!this.isMovingRight && !this.isMovingLeft && this.sprite.body.touching.down && !cursors.left.isDown && !cursors.right.isDown && !this.isDamaged) {
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
     * * Method used to receive damage to the user based on difficulty factor
     * 1 slice in Easy
     * 2 slice in Mid
     * 3 slice Hard
     *
     * @return void
     */
    public receiveDamage(scene: Phaser.Scene, difficultyFactor: number): void {
        // If is not invulnerable then affect with damage
        this.damageValue += difficultyFactor;
        this.sprite.setVelocityY(-SMALL_JUMP_ON_DAMAGE);
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
