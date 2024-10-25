import {VisualElement} from "./visual-element.js";

export class TextField extends VisualElement {
    private _input: HTMLInputElement;

    public constructor(element: HTMLElement | null) {
        super(element);

        this._input = this._root as HTMLInputElement;

        this._input.setAttribute("class", "cfg-text-field");
    }

    public static Create(): TextField {
        const input = document.createElement("input");

        return new TextField(input);
    }

    public setType(type: string): void {
        this._input.type = type;
    }

    public setValue(text: string): void {
        this._input.value = text;
    }

    public setPlaceholder(text: string): void {
        this._input.placeholder = text;
    }
}