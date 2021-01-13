import { readdirSync, renameSync } from "fs";
import opentype from "opentype.js";
import MeiucaEngineCore, { MeiucaEngineError } from "meiuca-engine-core";
import path from "path";

export default function (core: MeiucaEngineCore) {
  try {
    readdirSync(core.config.fonts!.output).forEach((file) => {
      let resolvedOutPath = path.resolve(core.config.fonts!.output, file);

      if (/\.(o|t)tf$/.test(file)) {
        let nameTable = opentype.loadSync(resolvedOutPath).tables.name || {
          postScriptName: file,
        };

        let postScriptName = Object.values(nameTable.postScriptName)[0];

        let outPathWithPSN = path.resolve(
          core.config.fonts!.output,
          `./${postScriptName}.${/[^.]+$/.exec(file)![0]}`
        );

        renameSync(resolvedOutPath, outPathWithPSN);
      }
    });
  } catch (err) {
    throw new MeiucaEngineError(err);
  }
}
