"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
function default_1(core) {
    if (!core.config.fonts)
        return new Promise((_, reject) => reject(new Error("fonts is undefined")));
    if (!core.config.fonts.linkCommand)
        return new Promise((_, reject) => reject(new Error("fonts.linkCommand is undefined")));
    console.log(chalk_1.default.greenBright("\ninfo"), "Running", chalk_1.default.blueBright(core.config.fonts.linkCommand));
    let [command, ...args] = core.config.fonts.linkCommand.split(" ");
    return new Promise((resolve, reject) => {
        let childProcess;
        try {
            childProcess = child_process_1.spawn(command, args, {
                shell: process.env.OS && process.env.OS.includes("Windows"),
            });
        }
        catch (err) {
            reject(err);
            return;
        }
        childProcess.stdout.on("data", (chunk) => {
            console.log("\t", chunk.toString("utf-8").replace("\n", ""));
        });
        childProcess.stderr.on("data", (chunk) => {
            console.warn("\t", chunk.toString("utf-8").replace("\n", ""));
        });
        childProcess.on("error", reject);
        childProcess.on("close", (code) => {
            if (code === 0) {
                console.log(`\n${command} executed with exit code: 0`);
                resolve(0);
            }
            else {
                reject(new Error(`${command} executed with exit code: ${code}`));
            }
        });
    });
}
exports.default = default_1;
