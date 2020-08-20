import path from 'path';
import fs from 'fs';
function getFilePrefix (filename: string): string {
    let matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0]
    }
    return '';
}

function initFilePath (baseDir: string, esModule: DirectoryEsModule) {
    let dir: string[] = fs.readdirSync(baseDir);
    let pro:Array<Promise<boolean>> = [];
    dir.forEach(async (item: string) => {
        let targetPath: string = path.resolve(baseDir, item);
        let stat = fs.statSync(targetPath)
        let pro = [], filenamePrefix = getFilePrefix(item);
        if (stat.isDirectory()) {
            esModule[item] = {}
            initFilePath(targetPath, esModule[item])
        } else {
            // filter the default file
            if (filenamePrefix !== 'index') {
                pro.push(
                    new Promise((resolve) => {
                        // esmodule with import function must return a promise object
                        import(targetPath).then((module) => {
                            if (module.default) {
                                esModule[filenamePrefix] = module.default;
                            } else {
                                esModule[filenamePrefix] = module;
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
    let esModule = {};
    await initFilePath(rootDir, esModule)
    return esModule;
}
export default async (module: NodeModule): Promise<object> => {
    const __ = path.sep;
    // get the root path
    const regDir = new RegExp(`(${__}(?:[^${__}]+${__}?)+)(?=${__}[^${__}]+)`);
    let directory = module.filename.match(regDir);
    if (directory && directory[0]) {
        return await makeEsModule(directory[0]);
    }
    return {}
}