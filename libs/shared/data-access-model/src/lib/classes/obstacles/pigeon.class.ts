import { Scene } from 'phaser';

import { createDropObject } from '../../../../../phaser-singleton/src/lib/utilities/object-creation-helper';
import { STANDING_FRAME } from '../../constants/game-keys.constants';
import { ONE_SECOND_TIMEOUT, WORLD_OBJECTS_VELOCITY, WORLD_OBJECTS_VELOCITY_Y } from '../../constants/game-units.constants';
import { LevelsEnum } from '../../enums/levels.enum';
import { Objects } from '../../enums/objects.enum';
import { Character } from '../character/character';
import { Poop } from './poop.class';
import { WorldObject } from './world-object.class';

export class Pigeon extends WorldObject {
    public name = Objects.PIGEON; // * Object name
    public isFlying: boolean = false; // * Prop to detect if pigeon is in the air
    public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // * Pigeon Sprite to be used
    public poop: Poop; //* Poop being thrown by this pigeon

    constructor(level: LevelsEnum) {
        console.log('pigeon.class.ts', 'constructor()');
        super();
        this.poop = new Poop(level);
        try {
            this.level = level;
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }

    /**
     * Method used to make fly grounded pigeon
     */
    public flyFromTheGround(scene: Scene, obstaclePigeonPoopGroup: Poop[], character: Character, handlerCallback: ArcadePhysicsCallback): void {
        if (!this.isFlying) {
            this.sprite.anims.play(STANDING_FRAME, true);
            this.sprite.setVelocityY(-WORLD_OBJECTS_VELOCITY_Y);
            this.sprite.setVelocityX(-WORLD_OBJECTS_VELOCITY);
            this.sprite.body.setAllowGravity(false);
            if (!this.isFlying) {
                this.isFlying = true;
                this.dropPoop(scene, obstaclePigeonPoopGroup, character, handlerCallback);
            }
        }
    }

    /**
     * Method used to make fly flying pigeon
     */
    public fly(): void {
        if (this.isFlying) {
            this.sprite.anims.play(STANDING_FRAME, true);
            this.sprite.body.setAllowGravity(false);
        }
    }

    /**
     * Method used to make drop poop from pigeon
     */
    public dropPoop(scene: Scene, obstaclePigeonPoopGroup: Poop[], character: Character, handlerCallback: ArcadePhysicsCallback): void {
        const randomPoopTime = (Math.floor(Math.random() * 3) + 6) * ONE_SECOND_TIMEOUT;
        setTimeout(() => {
            const poopSprite = createDropObject(scene, this.sprite.x, this.sprite.y, this.poop.name);
            obstaclePigeonPoopGroup.push(this.poop);
            scene.physics.add.collider(character.sprite, poopSprite, handlerCallback);
        }, randomPoopTime);
    }
}
