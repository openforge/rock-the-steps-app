// TODO: Here we are going to build all the logic for the character
// TODO: All moves, build and set to Phaser and assets will go here.

export class Character {
    constructor() {}

    public static async build(): Promise<Character> {
        console.log('character.class', 'build()');
        const tmpObject = new Character();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Character', error);
        }
    }
}
