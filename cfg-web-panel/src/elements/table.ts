import { Element } from "./element.js";

export class TableHeader extends Element {
    public constructor(headers: string[]) {
        const header = document.createElement("thead");
        const headerRow = document.createElement("tr");

        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        header.appendChild(headerRow);
        super(header);
    }
}

export class TableBody extends Element {
    private rows: HTMLElement[] = [];

    public constructor() {
        const body = document.createElement("tbody");
        super(body);
    }

    public addRow(values: any[]): HTMLElement {
        const tr = document.createElement("tr");

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            tr.appendChild(td);
        });

        this.root.appendChild(tr);
        return tr; // Возвращаем созданную строку
    }

    public deleteRow(row: HTMLElement): void {
        this.rows = this.rows.filter(r => r !== row);
        this.root.removeChild(row);
    }
}

export class Table<T extends  { [s: string]: any; }> extends Element {
    private _header: TableHeader;
    private _body: TableBody;
    private _items: Map<T, HTMLElement> = new Map();

    public constructor(headers: string[]) {
        const table = document.createElement("table");
        super(table);

        table.classList.add("table");

        this._header = new TableHeader(headers);
        this._body = new TableBody();

        this.root.appendChild(this._header.root);
        this.root.appendChild(this._body.root);
    }

    public add(value: T): void {
        const values = Object.values(value);
        const row = this._body.addRow(values);
        this._items.set(value, row);
    }

    public remove(value: T): void {
        const row = this._items.get(value); // Получаем строку по объекту
        if (row) {
            this._body.deleteRow(row);
            this._items.delete(value);
        }
    }
}
