const path = require('path');
const fs = require('fs');
const __ = path.sep;
const regDir = new RegExp(`(${__}(?:[^${__}]+${__}?)+)(?=${__}[^${__}]+)`); // get the root path

type ExportEsModule = {
    [key: string]: any;
    [key: number]: any;
}
export type DirectoryEsModule = {
    [key: string]: ExportEsModule | DirectoryEsModule
}
export type LayerEsModule = {
    [key: string]: ExportEsModule
}

export type DirectoryModule = {
    deepModule: DirectoryEsModule;
    layerModule: LayerEsModule;
}


function getFilePrefix (filename: string): string {
    let matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0]
    }
    return '';
}

function initFilePath (baseDir: string, deepModule: DirectoryEsModule, layerModule: LayerEsModule, prefix: string) {
    /* prefix: the base string of directory  */
    let dir: string[] = fs.readdirSync(baseDir);
    let pro:Array<Promise<boolean>> = [];
    dir.forEach(async (item: string) => {
        let targetPath: string = path.resolve(baseDir, item);
        let stat = fs.statSync(targetPath)
        let pro = [], filenamePrefix = getFilePrefix(item);
        let layerPrefix = prefix;
        if (stat.isDirectory()) {
            deepModule[item] = {};
            if (layerPrefix.length) {
                layerPrefix += `${__}${item}`;
            } else {
                layerPrefix += item;
            }
            initFilePath(targetPath, deepModule[item], layerModule, layerPrefix)
        } else {
            // filter the default file
            if (filenamePrefix !== 'index') {
                layerPrefix += `${__}${filenamePrefix}`;
                pro.push(
                    new Promise((resolve) => {
                        // esmodule with import function must return a promise object
                        import(targetPath).then((module) => {
                            if (module.default && Object.keys(module).length === 1) {
                                deepModule[filenamePrefix] = module.default;
                                layerModule[layerPrefix] = module.default;
                            } else {
                                deepModule[filenamePrefix] = module;
                                layerModule[layerPrefix] = module;
                            }
                            resolve(true);
                        })
                    })
                )
            }
        }
    })
    return Promise.all(pro)
}
async function makeEsModule (rootDir: string) {
    let esModule = {deepModule: {}, layerModule: {}};
    await initFilePath(rootDir, esModule.deepModule, esModule.layerModule, '')
    return esModule;
}
export default async (module: NodeModule): Promise<DirectoryEsModule> => {
    let directory = module.filename.match(regDir), output;
    if (directory && directory[0]) {
        output = await makeEsModule(directory[0]);
        return output.deepModule;
    }
    return {}
}
export async function importParseDirectory (module: NodeModule): Promise<DirectoryModule> {
    let directory = module.filename.match(regDir);
    if (directory && directory[0]) {
        return await makeEsModule(directory[0]);
    }
    return {
        deepModule: {},
        layerModule: {}
    }
}