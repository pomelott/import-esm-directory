/// <reference types="node" />
declare type ExportEsModule = {
    [key: string]: any;
    [key: number]: any;
};
export declare type DirectoryEsModule = {
    [key: string]: ExportEsModule | DirectoryEsModule;
};
export declare type LayerEsModule = {
    [key: string]: ExportEsModule;
};
export declare type DirectoryModule = {
    deepModule: DirectoryEsModule;
    layerModule: LayerEsModule;
};
declare const _default: (module: NodeModule) => Promise<DirectoryEsModule>;
export default _default;
export declare function importParseDirectory(module: NodeModule): Promise<DirectoryModule>;
