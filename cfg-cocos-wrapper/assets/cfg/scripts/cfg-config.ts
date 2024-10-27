import { List } from "./utils/list";

export interface ICFGConfig {
    getDefaultConfig(): ICFGConfig;
}

export class CFGConfig {
    private static _cfgBsConfigs: List<ICFGConfig> = new List<ICFGConfig>();
    private static _types: any[] = [];

    public static addToList(config: ICFGConfig) {
        this._cfgBsConfigs.add(config);
    }

    public static registerType(type: any) {
        this._types.push(type);
    }

    public static getAllConfigsTypes(): ICFGConfig[] {
        const configs: ICFGConfig[] = [];

        for (const cfgBsConfig of this._types) {
            const configInstance = new cfgBsConfig() as ICFGConfig;
            configInstance.getDefaultConfig();
            configs.push(configInstance);
        }

        return configs;
    }
}