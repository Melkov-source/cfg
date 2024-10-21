export class AsyncUtils {
    public static wait(seconds: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        })
    }

    public static async skip(): Promise<void> {
        return new Promise<void>(resolve => {
            resolve();
        })
    }
}