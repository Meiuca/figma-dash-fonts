"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meiuca_engine_core_1 = require("meiuca-engine-core");
function default_1(src, core) {
    try {
        let fonts = core.functions.parseDeepObj(require(src));
        let to_ret = {
            family: [],
            weight: [],
        };
        fonts.forEach((item) => {
            if (/(^|')[A-Z][A-Za-z]+/.test(item)) {
                to_ret.family.push(item.replace(/\s/g, "+").replace(/'/g, ""));
            }
            if (/^[0-9]{3}$/.test(item)) {
                to_ret.weight.push(item);
            }
        });
        return to_ret.family
            .map((fItem) => {
            return to_ret.weight.map((wItem) => (core.config.fonts?.provider || "")
                .replace(/\{f\}/g, fItem)
                .replace(/\{w\}/g, wItem));
        })
            .flat(2);
    }
    catch (err) {
        throw new meiuca_engine_core_1.MeiucaEngineError(err, "try 'init -f' to reset the config file");
    }
}
exports.default = default_1;
