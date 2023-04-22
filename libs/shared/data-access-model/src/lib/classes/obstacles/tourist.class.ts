export class Tourist {
    constructor() {}

    private static async build(): Promise<Tourist> {
        console.log('tourist.class.ts', 'build()');
        const tmpObject = new Tourist();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Tourist obstacle', error);
        }
    }
}
