export class ChineseFood {
    constructor() {}

    private static async build(): Promise<ChineseFood> {
        console.log('chinese-food.class.ts', 'build()');
        const tmpObject = new ChineseFood();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building ChineseFood obstacle', error);
        }
    }
}
