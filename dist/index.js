"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meiuca_engine_core_1 = __importStar(require("meiuca-engine-core"));
const font_downloader_1 = __importDefault(require("./font-downloader"));
const font_name_corrector_1 = __importDefault(require("./font-name-corrector"));
const link_converter_1 = __importDefault(require("./link-converter"));
const font_parser_1 = __importDefault(require("./font-parser"));
const path_1 = __importDefault(require("path"));
const linker_1 = __importDefault(require("./linker"));
async function default_1(core) {
    if (!core)
        core = new meiuca_engine_core_1.default();
    try {
        core.validations.validateFonts();
        let fonts = [];
        if (!core.config.fonts)
            return;
        if (core.config.fonts.files) {
            let parsedFonts = font_parser_1.default(path_1.default.resolve(core.config.figma.output, "./tokens.json"), core);
            let convertedLinks = await Promise.all(link_converter_1.default(parsedFonts));
            fonts = fonts.concat(convertedLinks.flat(core.functions.depth(convertedLinks)));
        }
        if (core.config.fonts.urls) {
            let convertedLinks = await Promise.all(link_converter_1.default(core.config.fonts.urls));
            fonts = fonts.concat(convertedLinks.flat(core.functions.depth(convertedLinks)));
        }
        if (core.config.fonts.directLinks) {
            fonts = fonts.concat(core.config.fonts.directLinks);
        }
        await font_downloader_1.default(fonts, core);
        font_name_corrector_1.default(core);
        if (core.config.fonts.linkCommand)
            await linker_1.default(core);
    }
    catch (err) {
        throw new meiuca_engine_core_1.MeiucaEngineError(err, "Check the config file");
    }
}
exports.default = default_1;
