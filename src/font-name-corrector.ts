import { readdirSync, renameSync } from "fs";
import opentype from "opentype.js";
import FigmaDashCore from "figma-dash-core";
import path from "path";

export default function (core: FigmaDashCore) {
  try {
    readdirSync(core.config.fonts!.output).forEach((file) => {
      let resolvedOutPath = path.resolve(core.config.fonts!.output, file);

      if (/(o|t)tf/.test(file)) {
        let postScriptName = Object.values(
          opentype.loadSync(resolvedOutPath).tables.name?.postScriptName
        )[0];

        renameSync(
          resolvedOutPath,
          path.resolve(
            core.config.fonts!.output,
            `./${postScriptName}.${/[^.]+$/.exec(file)![0]}`
          )
        );
      }
    });
  } catch (err) {
    throw new FigmaDashCore.FigmaDashError(err);
  }
}
