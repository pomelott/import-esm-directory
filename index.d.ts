/// <reference types="node" />
declare type DirectoryEsModule = {
    [key: string]: {} | DirectoryEsModule;
};
declare type layerEsModule = {
    [key: string]: NodeModule;
};
declare type EsModule = {
    deepModule: DirectoryEsModule;
    layerModule: layerEsModule;
};
declare const _default: (module: NodeModule) => Promise<EsModule>;
export default _default;
