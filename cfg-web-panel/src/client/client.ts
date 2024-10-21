export class Client {
    private socket: WebSocket | null = null;

    private _address: string;

    public constructor(private address: string) {
        this._address = address;
    }

    public connect(): void {
        this.socket = new WebSocket(this.address);

        this.socket.onopen = () => {
            console.log('Connected to the WebSocket server.');
        };

        this.socket.onmessage = (event: MessageEvent) => {
            this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
            console.log('Disconnected from the WebSocket server.');
        };

        this.socket.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };
    }

    public sendMessage(message: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            console.log('Message sent:', message);
        } else {
            console.error('WebSocket is not open. Message not sent:', message);
        }
    }

    private handleMessage(data: string): void {
        console.log('Message received:', data);
        // Здесь можно обработать входящее сообщение, например, парсить JSON
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
