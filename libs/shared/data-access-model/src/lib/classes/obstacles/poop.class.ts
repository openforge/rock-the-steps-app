export class Poop {
    constructor() {}

    private static async build(): Promise<Poop> {
        console.log('poop.class.ts', 'build()');
        const tmpObject = new Poop();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Poop obstacle', error);
        }
    }
}
