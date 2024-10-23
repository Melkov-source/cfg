import {VisualElement} from "./visual-element.js";

export class Button extends VisualElement {
    private _callbacks: (() => void)[] = [];

    public constructor(html: HTMLElement) {
        super(html);

        html.onclick = this.clickHandle.bind(this);
    }

    public static Create(text: string): Button {
        const html = document.createElement("button");

        html.textContent = text;

        return new Button(html);
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