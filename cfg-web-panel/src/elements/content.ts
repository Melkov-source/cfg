import {Element} from "./element.js";

export class Content extends Element {
    public constructor(id?: string) {
        const element = document.createElement("div");
        super(element);

        if(id) {
            element.setAttribute("id", id);
        }
    }
}