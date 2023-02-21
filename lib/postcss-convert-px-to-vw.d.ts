import { PluginCreator } from 'postcss';

interface Options {
    baseSize?: {
        rem?: number;
        vw?: number;
    };
    precision?: number;
    forceRemProps?: string[];
    keepRuleComment?: string;
    keepFileComment?: string;
    toRem?: boolean;
    toVw?: boolean;
}

declare const px2remvw: PluginCreator<Options>;

export { px2remvw as default };
