export enum ServiceType {
    DATABASE = "DATABASE",
    EVENT_DISPATCHER = "EVENT_DISPATCHER"
}

export interface IService {
    type: ServiceType;
}

export class Services {
    private static readonly _services: Map<ServiceType, IService> = new Map<ServiceType, IService>();

    public static add(service: IService): void {
        if (!this._services.has(service.type)) {
            this._services.set(service.type, service);
        }

        console.log("Services.add: " + service.type);
    }

    public static get<TService>(serviceType: ServiceType): TService {
        const service: TService = this._services.get(serviceType) as TService;

        if (service === undefined) {
            throw new Error("[services] not found: " + serviceType);
        }

        return service;
    }

    public static remove(serviceType: ServiceType): void {
        if (this._services.has(serviceType)) {
            this._services.delete(serviceType);
        }
    }
}