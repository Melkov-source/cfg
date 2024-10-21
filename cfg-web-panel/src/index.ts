import {Root} from "./elements/root.js";
import {Client} from "./client/client.js";
import {Button} from "./elements/button.js";
import {Q_TYPE} from "./elements/visual-element.js";

const ip: string = "127.0.0.1";
const port: number = 8080;

const host = `ws://${ip}:${port}/test`;

const client = new Client(host);

client.connect();


const root = new Root();

root.Q<Button>("send-button", Q_TYPE.ID, Button)?.onClick(() => {
    client.sendMessage("Hello Send MAN!");
});


