import { Tuple } from "./tuple";

type Selector<TInput, TOutput> = (item: TInput, index: number) => TOutput;

export class List<TValue> {
    private items: TValue[] = [];

    public add(item: TValue): List<TValue> {
        this.items.push(item);

        return this;
    }

    public addRange(list: List<TValue>): void {
        for (let item of list) {
            this.add(item);
        }
    }

    public remove(item: TValue): void {
        const index = this.items.indexOf(item);

        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    public get(index: number): TValue {
        return this.items[index];
    }

    public set(index: number, value: TValue): void {
        this.items[index] = value;
    }

    public getAll(): TValue[] {
        return this.items;
    }

    public clear(): void {
        this.items = [];
    }

    public forEach(callback: (item: TValue, index: number) => void) {
        this.items.forEach(callback);
    }

    [Symbol.iterator]() {
        let index = 0;

        const items = this.items;

        return {
            next(): IteratorResult<TValue> {
                if (index < items.length) {
                    return {value: items[index++], done: false};
                } else {
                    return {value: null, done: true};
                }
            }
        };
    }

    public get count(): number {
        return this.items.length;
    }

    public contains(value: TValue): boolean {
        for (const item of this.items) {
            if (item === value) {
                return true;
            }
        }
        return false;
    }

    public select<TOutput>(selector: Selector<TValue, TOutput>): List<TOutput> {
        const result = new List<TOutput>();
        for (let i = 0; i < this.items.length; i++) {
            let select = selector(this.items[i], i);

            if(select != null) {
                result.add(select);
            }

        }
        return result;
    }

    public static fromArray<TValue>(array: TValue[]): List<TValue> {
        const list = new List<TValue>();

        for (let item of array) {
            list.add(item);
        }

        return list;
    }

    public map<T1, T2>(callback: (item: TValue, index: number, array: TValue[]) => Tuple<T1, T2>): List<Tuple<T1, T2>> {
        let result = new List<Tuple<T1, T2>>();
        for (let i = 0; i < this.items.length; i++) {
            result.add(callback(this.items[i], i, this.items));
        }
        return result;
    }

    public filter(callback: (item: TValue, index: number, array: TValue[]) => boolean): List<TValue> {
        let result = new List<TValue>();
        for (let i = 0; i < this.items.length; i++) {
            if (callback(this.items[i], i, this.items)) {
                result.add(this.items[i]);
            }
        }
        return result;
    }

    public find(callback: (item: TValue, index: number, array: TValue[]) => boolean): TValue | null {
        for (let i = 0; i < this.items.length; i++) {
            if (callback(this.items[i], i, this.items)) {
                return this.items[i];
            }
        }

        return null;
    }

    public findIndex(callback: (item: TValue, index: number, array: TValue[]) => boolean): number {
        for (let i = 0; i < this.items.length; i++) {
            if (callback(this.items[i], i, this.items)) {
                return i;
            }
        }
        return -1;
    }

    public sort(callback: (a: TValue, b: TValue) => number): List<TValue> {
        return List.fromArray(this.items.sort(callback));
    }

    public reverse(): void {
        this.items.reverse();
    }

    public reduce<T>(callback: (previousValue: T, currentValue: TValue, currentIndex: number, array: TValue[]) => T, initialValue: T): T {
        return this.items.reduce(callback, initialValue);
    }

    public every(callback: (item: TValue, index: number, array: TValue[]) => boolean): boolean {
        return this.items.every(callback);
    }

    public some(callback: (item: TValue, index: number, array: TValue[]) => boolean): boolean {
        return this.items.some(callback);
    }

    public toArray(): TValue[] {
        return this.items;
    }
}