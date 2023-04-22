export class Apple {
    constructor() {}

    private static async build(): Promise<Apple> {
        console.log('apple.class.ts', 'build()');
        const tmpObject = new Apple();
        try {
            return tmpObject;
        } catch (error) {
            console.error('Error building Apple obstacle', error);
        }
    }
}
