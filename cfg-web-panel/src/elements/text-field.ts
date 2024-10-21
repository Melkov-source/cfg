import {VisualElement} from "./visual-element.js";

export class TextField extends VisualElement {
    private _input: HTMLInputElement;

    public constructor(element: HTMLElement | null) {
        super(element);

        this._input = this._root as HTMLInputElement;
    }

    public static Create(): TextField {
        const input = document.createElement("input");

        return new TextField(input);
    }

    public setType(type: string): void {
        this._input.type = type;
    }

    public setPlaceholder(text: string): void {
        this._input.placeholder = text;
    }
}