import {Button} from "./elements/button.js";
import {Element} from "./elements/element.js";
import {Content} from "./elements/content.js";
import {Table} from "./elements/table.js";

const root_container = document.getElementById("root") as HTMLElement;

const root = new Element(root_container);

const content_buttons = new Content("button-bucket");

interface User {
    name: string,
    age: number,
    is_student: boolean
}

const table = new Table<User>(["name", "age", "is_student"]);

table.setParent(root);

content_buttons.setParent(root);

for (let i = 0; i < 10; i++) {
    const button = new Button(i, `Button: ${i}`);

    button.root.classList.add("btn");
    button.root.classList.add("btn-primary");

    const user: User = {
        name: `Vasya ${i}`,
        age: i,
        is_student: i % 2 === 0
    }

    button.onClick(() => {
        console.log(i);

        if(button.getParent() === content_buttons) {
            button.setParent(root)
            table.add(user);
        } else {
            button.setParent(content_buttons);
            table.remove(user);
        }

    });

    table.add(user)

    button.setParent(root);
}
