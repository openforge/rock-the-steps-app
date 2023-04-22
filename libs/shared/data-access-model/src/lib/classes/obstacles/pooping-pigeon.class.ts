export class PoopingPigeon {
    constructor() {}

    private static async build(): Promise<PoopingPigeon> {
        console.log('pooping-pigeon.class.ts', 'build()');
        const tmpObject = new PoopingPigeon();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building PoopingPigeon obstacle', error);
        }
    }
}
