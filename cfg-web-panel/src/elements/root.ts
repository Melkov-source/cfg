import { VisualElement } from "./visual-element.js";

export class Root extends VisualElement {
    public constructor() {
        const root = document.getElementById("root");
        super(root);
    }
}