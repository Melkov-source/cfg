import {BehaviorSubject} from "./utils";
import {CFGBehaviourSubject} from "db://assets/cfg/scripts/common";

export interface ICFGConfig {
    getDefaultConfig(): ICFGConfig;
}

export class CFGConfig {
    private static _types: any[] = [];

    private static _cfgBsConfigs: Map<number, any> = new Map();
    private static _cfgBsConfigNextMethodCashed: Map<number, Function> = new Map();

    public static registerType(type: any) {
        this._types.push(type);
    }

    public static getAllConfigsTypes(): any {
        const configs: ICFGConfig[] = [];

        for (const cfgBsConfig of this._types) {
            configs.push(cfgBsConfig);
        }

        return configs;
    }

    public static async collectConfigsBehaviours(): Promise<void> {
        const allTypes = this.getAllConfigsTypes();

        for (let index = 0, count = allTypes.length; index < count; index++) {
            const type = allTypes[index];

            const hash = this.hash(type.name);

            const config = new type() as ICFGConfig;

            const defaultConfig = config.getDefaultConfig();

            const behaviourSubject = new CFGBehaviourSubject<ICFGConfig>(defaultConfig);

            const checkBehaviourMethod = behaviourSubject.checkBehaviourBind.bind(this);

            this._cfgBsConfigNextMethodCashed.set(hash, checkBehaviourMethod);
            this._cfgBsConfigs.set(hash, behaviourSubject);
        }
    }

    public static testConfigMethods() {
        this._cfgBsConfigNextMethodCashed.forEach((method, hash) => {
            console.log(`Calling *Next* method for hash: ${hash}`);
            method();
        });
    }

    public static hash(text: string): number {
        let hash = 0x811c9dc5;
        const PRIME = 0x01000193;

        for (let i = 0; i < text.length; ++i) {
            const value = text.charCodeAt(i);
            hash ^= value;
            hash = Math.imul(hash, PRIME) >>> 0;
        }

        return hash | 0;
    }

    public static onConfigChangedHandle(hash: number, icfgConfig: ICFGConfig) {
        if (!this._cfgBsConfigs.has(hash)) {
            console.log(`Not found config for target hash: ${hash}`);
            return;
        }

        if (!this._cfgBsConfigNextMethodCashed.has(hash)) {
            console.log(`Not found next method reflection cashed for target hash: ${hash}`);
            return;
        }

        const config_behaviour_subject = this._cfgBsConfigs.get(hash);
        const next_method = this._cfgBsConfigNextMethodCashed.get(hash)!;

        const args: any[] = []
        {
            icfgConfig
        }

        next_method.call(config_behaviour_subject, args);
    }
}