import {VisualElement} from "./visual-element.js";

export class Label extends VisualElement {
    private readonly _label: HTMLLabelElement;

    public constructor(html: HTMLElement) {
        super(html);

        this._label = html as HTMLLabelElement;
    }

    public setText(text: string): void {
        this._label.textContent = text;
    }

    public static Create() {
        const label = document.createElement('label');

        return new Label(label);
    }
}