import {VisualElement} from "./visual-element.js";

export class Input extends VisualElement {
    protected input: HTMLInputElement;

    public constructor(element: HTMLElement | null) {
        super(element);

        this.input = this._root as HTMLInputElement;
    }

    public setType(type: string): void {
        this.input.type = type;
    }
}