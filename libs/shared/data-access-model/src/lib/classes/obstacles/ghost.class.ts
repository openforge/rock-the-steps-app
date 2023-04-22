export class Ghost {
    constructor() {}

    private static async build(): Promise<Ghost> {
        console.log('ghost.class.ts', 'build()');
        const tmpObject = new Ghost();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Ghost obstacle', error);
        }
    }
}
