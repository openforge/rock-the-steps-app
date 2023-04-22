export class Hurdle {
    constructor() {}

    private static async build(): Promise<Hurdle> {
        console.log('hurdle.class.ts', 'build()');
        const tmpObject = new Hurdle();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Hurdle obstacle', error);
        }
    }
}
