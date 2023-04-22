export class Trashcan {
    constructor() {}

    private static async build(): Promise<Trashcan> {
        console.log('trashcan.class.ts', 'build()');
        const tmpObject = new Trashcan();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Trashcan obstacle', error);
        }
    }
}
