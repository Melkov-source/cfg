import {Input} from "./input.js";
import {VisualElement} from "./visual-element.js";

export class CheckBox extends Input {
    public constructor(html: HTMLElement) {
        super(html);

        this.setType("checkbox");
        this.input.setAttribute("class", "cfg-checkbox");
    }

    public static Create(): CheckBox {
        const input = document.createElement("input");

        return new CheckBox(input);
    }
}