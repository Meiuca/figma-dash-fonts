"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const opentype_js_1 = __importDefault(require("opentype.js"));
const figma_dash_core_1 = __importDefault(require("figma-dash-core"));
const path_1 = __importDefault(require("path"));
function default_1(core) {
    try {
        fs_1.readdirSync(core.config.fonts.output).forEach((file) => {
            let resolvedOutPath = path_1.default.resolve(core.config.fonts.output, file);
            if (/(o|t)tf/.test(file)) {
                let postScriptName = Object.values(opentype_js_1.default.loadSync(resolvedOutPath).tables.name?.postScriptName)[0];
                fs_1.renameSync(resolvedOutPath, path_1.default.resolve(core.config.fonts.output, `./${postScriptName}.${/[^.]+$/.exec(file)[0]}`));
            }
        });
    }
    catch (err) {
        throw new figma_dash_core_1.default.FigmaDashError(err);
    }
}
exports.default = default_1;
