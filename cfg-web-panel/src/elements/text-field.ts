import {Input} from "./input.js";

export class TextField extends Input {
    public constructor(element: HTMLElement | null) {
        super(element);

        this.input.setAttribute("class", "cfg-text-field");

        this.setType("text");
    }

    public static Create(): TextField {
        const input = document.createElement("input");

        return new TextField(input);
    }

    public setValue(text: string): void {
        this.input.value = text;
    }

    public setPlaceholder(text: string): void {
        this.input.placeholder = text;
    }
}