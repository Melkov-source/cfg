import 'dotenv/config';
import {Database} from "../services/index.js";
import {Server} from "../server/index.js";
import {EventDispatcher} from "../services/event-dispatcher/event-dispatcher.js";

type Task = () => Promise<number>

export class App {
    private static declare _server: Server;
    private static declare _database: Database;

    private static _tasks: Map<string, Task> = new Map<string, Task>();

    public static async run(): Promise<void> {
        new EventDispatcher();

        this._tasks.set("database initialize process", async () => {
            this._database = new Database({
                host: process.env.DATABASE_HOST!,
                port: Number.parseInt(process.env.DATABASE_PORT!),
                user: process.env.DATABASE_USER!,
                password: process.env.DATABASE_PASSWORD!,
                database: process.env.DATABASE_NAME!,
                connectionLimit: 15
            });

            return 0;
        });

        this._tasks.set("rest-api server launching", async () => {
            const port = parseInt(process.env.REST_API_PORT!);
            this._server = new Server(port);

            this._server.start();

            return 0;
        });

        let targetValue: number = 1;

        for (const [description, task] of this._tasks) {
            console.log(`Executing task [${targetValue}]: ` + description);

            try {
                const result = await task();
                if (result == 1) {
                    break;
                }
            } catch (error) {
                console.error(error);
            }

            targetValue++;
        }
    }
}