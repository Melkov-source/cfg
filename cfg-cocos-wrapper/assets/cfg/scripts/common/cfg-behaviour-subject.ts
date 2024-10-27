import {ICFGConfig} from "../cfg-config";

type Callback<TObject> =  (value: TObject) => void
type CallbackWithOld<TObject> =  (old_value: TObject, new_value: TObject) => void

export class CFGBehaviourSubject<TObject extends ICFGConfig> {
    private _callbacks: Callback<TObject>[] = [];
    private _callbacksWithOld: CallbackWithOld<TObject>[] = [];

    public value: TObject;

    public constructor(object: TObject) {
        this.value = object;
    }

    public next(value: TObject): void {
        this.value = value;

        for (let index = 0, count = this._callbacks.length; index < count; index++) {
            const callback = this._callbacks[index];

            callback(value);
        }

        for (let index = 0, count = this._callbacksWithOld.length; index < count; index++) {
            const callback = this._callbacksWithOld[index];

            callback(this.value, value);
        }
    }

    public notify(): void {
        for (let index = 0, count = this._callbacks.length; index < count; index++) {
            const callback = this._callbacks[index];

            callback(this.value);
        }

        for (let index = 0, count = this._callbacksWithOld.length; index < count; index++) {
            const callback = this._callbacksWithOld[index];

            callback(this.value, this.value);
        }
    }

    //this is just for the test
    public checkBehaviourBind(): void {
        console.log("Check behaviour was invoked");
    }

    public subscribe(callback: Callback<TObject>): void {
        this._callbacks.push(callback);

        callback(this.value);
    }

    public unsubscribe(callback: Callback<TObject>): void {
        this._callbacks = this._callbacks.filter(cb => cb !== callback);
    }

    public subscribeWithOld(callback: CallbackWithOld<TObject>, ): void {
        this._callbacksWithOld.push(callback);
    }
}