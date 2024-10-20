export class Element {
    public root: HTMLElement;
    protected parent: Element | undefined;

    public constructor(element: HTMLElement) {
        this.root = element;
    }

    public setParent(newParent: Element): void {
        if (this.parent) {
            this.parent.root.removeChild(this.root);
        }

        this.parent = newParent;
        newParent.root.appendChild(this.root);
    }

    public addStylesheet(href: string): void {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        document.head.appendChild(link);
    }

    public addInlineStyles(styles: string): void {
        const style = document.createElement('style');
        style.textContent = styles;

        this.root.appendChild(style);
    }

    public getParent(): Element | undefined {
        return this.parent;
    }
}
