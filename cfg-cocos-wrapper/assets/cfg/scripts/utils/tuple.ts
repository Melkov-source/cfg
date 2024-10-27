export class Tuple<TValue1, TValue2> {
    public item1: TValue1;
    public item2: TValue2;

    public constructor(value1: TValue1, value2: TValue2) {
        this.item1 = value1;
        this.item2 = value2;
    }
}