"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const figma_dash_core_1 = require("figma-dash-core");
const axios_1 = __importDefault(require("axios"));
async function default_1(fonts, core) {
    let outPath = path_1.default.resolve(process.cwd(), core.config.fonts.output);
    if (!fs_1.existsSync(outPath))
        fs_1.mkdirSync(outPath, { recursive: true });
    let fontDownloadPromises = fonts.map(async (font) => {
        let out = path_1.default.resolve(outPath, `./${font.local}`);
        console.log(chalk_1.default.greenBright("\ninfo"), "Downloading from", chalk_1.default.gray(font.src));
        try {
            let { data } = await axios_1.default.get(font.src, {
                responseType: "arraybuffer",
            });
            fs_1.writeFileSync(out, data);
        }
        catch (err) {
            throw new figma_dash_core_1.FigmaDashError(err, `Error thrown when fetching ${font.src}`);
        }
    });
    await Promise.all(fontDownloadPromises);
}
exports.default = default_1;
