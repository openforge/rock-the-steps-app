export class Cone {
    constructor() {}

    private static async build(): Promise<Cone> {
        console.log('cone.class.ts', 'build()');
        const tmpObject = new Cone();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Cone obstacle', error);
        }
    }
}
