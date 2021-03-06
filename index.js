"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.importParseDirectory = void 0;
var path = require('path');
var fs = require('fs');
var __ = path.sep;
var regDir = new RegExp("(" + __ + "(?:[^" + __ + "]+" + __ + "?)+)(?=" + __ + "[^" + __ + "]+)"); // get the root path
function getFilePrefix(filename) {
    var matchRes = filename.match(/.*(?=\.[^\.]+)/);
    if (matchRes && matchRes.length) {
        return matchRes[0];
    }
    return '';
}
function initFilePath(baseDir, deepModule, layerModule, prefix) {
    var _this = this;
    /* prefix: the base string of directory  */
    var dir = fs.readdirSync(baseDir);
    var pro = [];
    dir.forEach(function (item) { return __awaiter(_this, void 0, void 0, function () {
        var targetPath, stat, pro, filenamePrefix, layerPrefix;
        return __generator(this, function (_a) {
            targetPath = path.resolve(baseDir, item);
            stat = fs.statSync(targetPath);
            pro = [], filenamePrefix = getFilePrefix(item);
            layerPrefix = prefix;
            if (stat.isDirectory()) {
                deepModule[item] = {};
                if (layerPrefix.length) {
                    layerPrefix += "" + __ + item;
                }
                else {
                    layerPrefix += item;
                }
                initFilePath(targetPath, deepModule[item], layerModule, layerPrefix);
            }
            else {
                // filter the default file
                if (filenamePrefix !== 'index') {
                    layerPrefix += "" + __ + filenamePrefix;
                    pro.push(new Promise(function (resolve) {
                        // esmodule with import function must return a promise object
                        Promise.resolve().then(function () { return require(targetPath); }).then(function (module) {
                            if (module["default"] && Object.keys(module).length === 1) {
                                deepModule[filenamePrefix] = module["default"];
                                layerModule[layerPrefix] = module["default"];
                            }
                            else {
                                deepModule[filenamePrefix] = module;
                                layerModule[layerPrefix] = module;
                            }
                            resolve(true);
                        });
                    }));
                }
            }
            return [2 /*return*/];
        });
    }); });
    return Promise.all(pro);
}
function makeEsModule(rootDir) {
    return __awaiter(this, void 0, void 0, function () {
        var esModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    esModule = { deepModule: {}, layerModule: {} };
                    return [4 /*yield*/, initFilePath(rootDir, esModule.deepModule, esModule.layerModule, '')];
                case 1:
                    _a.sent();
                    return [2 /*return*/, esModule];
            }
        });
    });
}
exports["default"] = (function (module) { return __awaiter(void 0, void 0, void 0, function () {
    var directory, output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                directory = module.filename.match(regDir);
                if (!(directory && directory[0])) return [3 /*break*/, 2];
                return [4 /*yield*/, makeEsModule(directory[0])];
            case 1:
                output = _a.sent();
                return [2 /*return*/, output.deepModule];
            case 2: return [2 /*return*/, {}];
        }
    });
}); });
function importParseDirectory(module) {
    return __awaiter(this, void 0, void 0, function () {
        var directory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    directory = module.filename.match(regDir);
                    if (!(directory && directory[0])) return [3 /*break*/, 2];
                    return [4 /*yield*/, makeEsModule(directory[0])];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, {
                        deepModule: {},
                        layerModule: {}
                    }];
            }
        });
    });
}
exports.importParseDirectory = importParseDirectory;
