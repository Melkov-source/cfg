import express, { Application } from "express";
import cors from "cors";
import {WebSocketServer} from "ws";

export class ServerApp {
    private readonly _express: Application;
    private readonly _port: number;
    private _wss: WebSocketServer | null = null;

    public constructor(port: number) {
        this._port = port;

        this._express = express();

        this._express.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));

        this._express.use(express.json());
        this._express.use(express.urlencoded({ extended: true }));
    }

    public static getTime(): number {
        const date_now = new Date();
        return Math.floor(date_now.getTime() / 1000);
    }

    public start(): void {
        const server = this._express.listen(this._port, this.onStarted.bind(this));

        server.on("error", this.onError.bind(this));

        this.setupWebSocket(server); // Настройка WebSocket-сервера
    }

    private setupWebSocket(server: any): void {
        this._wss = new WebSocketServer({ server }); // Создаем WebSocket сервер

        this._wss.on("connection", (ws) => {
            console.log("New client connected");

            ws.on("message", (message) => {
                console.log(`Received message: ${message}`);
                const responseMessage = `Server received: ${message}`;
                ws.send(responseMessage); // Отправка ответа клиенту
            });

            ws.on("close", () => {
                console.log("Client disconnected");
            });
        });
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
