export enum Q_TYPE {
    CLASS,
    ID
}

export class VisualElement {
    protected _root: HTMLElement;

    protected declare _parent: VisualElement;

    constructor(element: HTMLElement | null) {
        if (!element) {
            throw Error("HTMLElement in null!");
        }


        this._root = element;
    }

    public get root(): HTMLElement {
        return this._root;
    }

    public add(element: VisualElement): void {
        this._root.append(element._root);
    }

    public remove(element: VisualElement): void {
        this._root.removeChild(element._root);
    }

    public setParent(parent: VisualElement) {
        if (this._parent) {
            this._parent.remove(this);
        }

        parent.root.appendChild(this._root);

        this._parent = parent;
    }

    public setStyle(style: Partial<CSSStyleDeclaration>) {
        Object.assign(this._root.style, style);
    }

    public addClass(className: string) {
        this._root.classList.add(className);
    }

    public removeClass(className: string) {
        this._root.classList.remove(className);
    }

    public Q<T extends VisualElement>(
        key: string,
        type: Q_TYPE,
        constructor: new (element: HTMLElement) => T
    ): T | null {
        return this.findElement(this._root, key, type, constructor);
    }

    private findElement<T extends VisualElement>(
        parent: HTMLElement,
        key: string,
        type: Q_TYPE,
        constructor: new (element: HTMLElement) => T
    ): T | null {
        for (let index = 0; index < parent.children.length; index++) {
            const child = parent.children[index] as HTMLElement;

            switch (type) {
                case Q_TYPE.CLASS:
                    if (child.classList.contains(key)) {
                        return new constructor(child);
                    }
                    break;
                case Q_TYPE.ID:
                    if (child.id === key) {
                        return new constructor(child);
                    }
                    break;
            }

            const result = this.findElement(child, key, type, constructor);

            if (result) {
                return result;
            }
        }
        return null;
    }
}
