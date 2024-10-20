import {Element} from "./element.js";

export class Button extends Element {
    private _callbacks: (() => void)[] = [];

    public constructor(id: number, text: string) {
        const button =  document.createElement('button');
        super(button);

        button.setAttribute("id", id.toString());
        button.setAttribute("type", "button");
        button.innerText = text;
        button.onclick = this.clickHandle.bind(this);
    }

    public onClick(callback: () => void): void {
        this._callbacks.push(callback);
    }

    public offClick(callback: () => void): void {
        const index = this._callbacks.indexOf(callback);

        if(index !== -1) {
            this._callbacks = this._callbacks.splice(index, 1);
        }
    }

    private clickHandle(): void {
        for (const callback of this._callbacks) {
            if(callback) {
                callback();
            }
        }
    }
}