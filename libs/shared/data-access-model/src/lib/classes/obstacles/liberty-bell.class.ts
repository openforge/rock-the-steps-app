export class LibertyBell {
    constructor() {}

    private static async build(): Promise<LibertyBell> {
        console.log('liberty-bell.class.ts', 'build()');
        const tmpObject = new LibertyBell();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building LibertyBell obstacle', error);
        }
    }
}
