export class ChesseSteak {
    constructor() {}

    private static async build(): Promise<ChesseSteak> {
        console.log('chesse-steak.class.ts', 'build()');
        const tmpObject = new ChesseSteak();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building ChesseSteak obstacle', error);
        }
    }
}
