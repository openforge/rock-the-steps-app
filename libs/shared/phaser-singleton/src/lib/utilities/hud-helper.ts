import {
    BUTTON_JUMP_X,
    BUTTON_LEFT_X,
    BUTTON_RIGHT_X,
    BUTTONS_MOVE_Y,
    Character,
    CONTROLS_KEY,
    DOWN_EVENT,
    JUMP_KEY,
    LEFT_KEY,
    POINTER_DOWN_EVENT,
    POINTER_UP_EVENT,
    RIGHT_KEY,
    UP_EVENT,
} from '@openforge/shared/data-access-model';
import { Scene } from 'phaser';

/**
 * * Method used to create the buttons of movement and jump
 *
 * @private
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createButtons(scene: Scene, character: Character, spaceBarKey: Phaser.Input.Keyboard.Key): void {
    const buttonLeft = scene.add.sprite(BUTTON_LEFT_X, window.innerHeight - BUTTONS_MOVE_Y, CONTROLS_KEY, LEFT_KEY);
    buttonLeft.setInteractive();
    buttonLeft.on(POINTER_DOWN_EVENT, () => (character.isMovingLeft = true), scene);
    buttonLeft.on(POINTER_UP_EVENT, () => (character.isMovingLeft = false), scene);
    const buttonRight = scene.add.sprite(BUTTON_RIGHT_X, window.innerHeight - BUTTONS_MOVE_Y, CONTROLS_KEY, RIGHT_KEY);
    buttonRight.setInteractive();
    buttonRight.on(POINTER_DOWN_EVENT, () => (character.isMovingRight = true), scene);
    buttonRight.on(POINTER_UP_EVENT, () => (character.isMovingRight = false), scene);
    const buttonJump = scene.add.sprite(window.innerWidth - BUTTON_JUMP_X, window.innerHeight - BUTTONS_MOVE_Y, JUMP_KEY);
    buttonJump.setInteractive();
    buttonJump.on(POINTER_DOWN_EVENT, () => (character.isJumping = true), scene);
    buttonJump.on(POINTER_UP_EVENT, () => (character.isJumping = false), scene);
    spaceBarKey.on(DOWN_EVENT, () => (character.isJumping = true), scene);
    spaceBarKey.on(UP_EVENT, () => (character.isJumping = false), scene);

    // TODO - re-add pause button
    // const pauseButton = scene.add
    //     .image(scene.sys.canvas.width - PAUSE_BUTTON_X, PAUSE_BUTTON_Y, PAUSE_BUTTON)
    //     .setScale(SCALE_PAUSE_BUTTON, SCALE_PAUSE_BUTTON)
    //     .setOrigin(1, 0)
    //     .setInteractive();
    // pauseButton.on(POINTER_DOWN_EVENT, showPauseModal, scene);
}

/**
 * Method used to display pause modal
 *
 * @private
 */
// export function showPauseModal(_scene: Scene): void {
//     // Pause the game
//     GameEngineSingleton.scene = _scene;
//     // scene.pause();
//     // scene.run(PAUSE_SCENE);
// }
