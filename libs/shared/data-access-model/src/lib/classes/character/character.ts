export class Character {
    public name = 'character';
    public isInvulnerable: boolean = false; // Flag to detect gloves invulnerability
    public isMovingLeft: boolean = false; // * Flag to detect if character is pressing left button
    public isMovingRight: boolean = false; // * Flag to detect is character is pressing right button
    public isJumping: boolean = false; // * Flag to detect is character is pressing jump button
    public isDamaged: boolean = false; // * Flag to detect is character is being damaged

    constructor() {
        try {
            //
        } catch (error) {
            console.error(`Error building obstacle ${this.name}`, error);
        }
    }
}
