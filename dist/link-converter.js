"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = __importDefault(require("css"));
const figma_dash_core_1 = require("figma-dash-core");
const axios_1 = __importDefault(require("axios"));
const safeStringArray = ["error", "error"];
function cssMapper(rule) {
    let font = [];
    if (!rule.declarations)
        return;
    rule.declarations
        .filter((item) => item.property == "src")
        .forEach((declaration) => {
        let urlRegExp = /url\(([^)]+)/;
        let src = (urlRegExp.exec(declaration.value) || safeStringArray)[1];
        let srcWithoutQuote = src.replace(/'/g, "");
        font.push(srcWithoutQuote);
    });
    rule.declarations
        .filter((item) => item.property == "font-family")
        .forEach((declaration) => {
        let fontFamily = (declaration.value || "empty").replace(/\s/g, "-");
        let fontFamilyWithoutQuote = fontFamily.replace(/'/g, "");
        let fontWeight = (rule.declarations.filter((item) => item.property == "font-weight") || safeStringArray)[0].value;
        let fontStyle = rule.declarations.filter((item) => item.property == "font-style")[0].value;
        font.push(fontFamilyWithoutQuote + fontWeight + fontStyle);
    });
    return {
        src: font[0],
        local: font[1] + "." + (/[^.]+$/.exec(font[0]) || ["n"])[0],
    };
}
function default_1(urls) {
    return urls.map(async (url) => {
        try {
            let { data } = await axios_1.default.get(url);
            let cssObj = css_1.default.parse(data);
            return (cssObj.stylesheet?.rules || []).map(cssMapper);
        }
        catch (err) {
            throw new figma_dash_core_1.FigmaDashError(err, `error thrown when fetching ${url}`);
        }
    });
}
exports.default = default_1;
