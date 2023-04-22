export class Pigeon {
    constructor() {}

    private static async build(): Promise<Pigeon> {
        console.log('pigeon.class.ts', 'build(');
        const tmpObject = new Pigeon();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Pigeon obstacle', error);
        }
    }
}
