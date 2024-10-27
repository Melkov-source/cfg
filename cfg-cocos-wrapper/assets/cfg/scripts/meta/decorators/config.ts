import {CFGConfig, ICFGConfig} from "../../cfg-config";

export function config(target: any) {
    CFGConfig.registerType(target);
}