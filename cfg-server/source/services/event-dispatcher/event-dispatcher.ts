import {IService, Services, ServiceType} from "../services.js";

type Func<T> = (event: T) => Promise<void>;

export interface IEvent { }

export interface IEventDispatcher extends IService {
    addHandler<TEvent extends IEvent>(typeCode: number, handler: (event: TEvent) => Promise<void>): void;
    removeHandler<TEvent extends IEvent>(typeCode: number, handler: (event: TEvent) => Promise<void>): void;

    dispatchAsync<TEvent extends IEvent>(typeCode: number, event: TEvent): Promise<void>;
    dispatch<TEvent extends IEvent>(typeCode: number, event: TEvent): void;
}

export enum EVENTS {
    USER_PHONE_NUMBER_VERIFIED = 0,
}

export class EventDispatcher implements IEventDispatcher {
    public type: ServiceType = ServiceType.EVENT_DISPATCHER;

    private readonly _handlers: Record<number, Func<IEvent>[]> = {};

    public constructor() {
        Services.add(this);
    }

    private getHandlers<TEvent extends IEvent>(typeCode: number): Func<TEvent>[] {
        let handlers = this._handlers[typeCode] as Func<TEvent>[];

        if (handlers === null || handlers === undefined) {
            handlers = [];
            this._handlers[typeCode] = handlers as unknown as Func<IEvent>[];
        }

        return handlers;
    }

    public addHandler<TEvent extends IEvent>(typeCode: number, handler: (event: TEvent) => Promise<void>): void {
        const handlers = this.getHandlers<TEvent>(typeCode);
        handlers.push(handler);
    }

    public removeHandler<TEvent extends IEvent>(typeCode: number, handler: (event: TEvent) => Promise<void>): void {
        const handlers = this.getHandlers<TEvent>(typeCode);
        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    public async dispatchAsync<TEvent extends IEvent>(typeCode: number, event: TEvent): Promise<void> {
        const handlers = this.getHandlers<TEvent>(typeCode);
        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public dispatch<TEvent extends IEvent>(typeCode: number, event: TEvent): void {
        this.dispatchAsync(typeCode, event);
    }
}