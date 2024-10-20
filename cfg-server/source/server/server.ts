import express, {Application} from "express";
import cors from "cors";

export class Server {
    private readonly _express: Application;
    private readonly _port: number;

    public constructor(port: number) {
        this._port = port;

        this._express = express();

        this._express.use(cors({
            origin: "*", // Здесь можно указать конкретный домен, который разрешен
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));

        this._express.use(express.json());
        this._express.use(express.urlencoded({
            extended: true
        }));

        //this._express.use("/mission", new MissionController().router);
    }

    public static getTime(): number {
        const date_now = new Date();
        return Math.floor(date_now.getTime() / 1000);
    }

    public start(): void {
        const server = this._express.listen(this._port, this.onStarted.bind(this));

        server.on("error", this.onError.bind(this));
    }

    private onStarted(): void {
        console.log(`Server is running on port ${this._port}.`);
    }

    private onError(error: any): void {
        if (error.code === "EADDRINUSE") {
            console.log("Error: address already in use");
        } else {
            console.log(error);
        }
    }
}