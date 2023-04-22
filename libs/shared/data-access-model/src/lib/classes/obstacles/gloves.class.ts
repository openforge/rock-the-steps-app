export class Gloves {
    constructor() {}

    private static async build(): Promise<Gloves> {
        console.log('gloves.class.ts', 'build()');
        const tmpObject = new Gloves();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Gloves obstacle', error);
        }
    }
}
