import { _decorator, Component} from "cc";
import {config} from "../../cfg/scripts/meta/decorators/config";
import {CFGConfig, ICFGConfig} from "../../cfg/scripts/cfg-config";

@_decorator.ccclass("SandboxManager")
export class SandboxManager extends Component{
    protected override async start(): Promise<void> {
        await CFGConfig.collectConfigsBehaviours();
        CFGConfig.testConfigMethods();
    }
}

@config
class ExampleConfig implements ICFGConfig {
    public getDefaultConfig(): ICFGConfig {
        console.log("get default config method was called from ", this.constructor.name);
        return new ExampleConfig();
    }
}