import {EventTarget} from "cc";

export enum REACTIVE_EVENT {
    CHANGED = "CHANGED"
}

export class Reactive<TObject> {
    public readonly event: EventTarget;

    public set value(value: TObject) {
        this._value = value;

        this.event.emit(REACTIVE_EVENT.CHANGED, this._value);
    }

    public get value(): TObject {
        return this._value;
    }

    private _value: TObject;

    public constructor(value: TObject) {
        this.event = new EventTarget()

        this._value = value;
    }
}