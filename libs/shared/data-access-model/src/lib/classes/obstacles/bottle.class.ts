export class Bottle {
    constructor() {}

    private static async build(): Promise<Bottle> {
        console.log('bottle.class.ts', 'build()');
        const tmpObject = new Bottle();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Bottle obstacle', error);
        }
    }
}
