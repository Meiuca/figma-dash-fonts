const { readdirSync, renameSync } = require("fs");
const opentype = require("opentype.js");
const exceptionHandler = require("figma-dash-core/exception-handler");
const path = require("path");
const config = require("figma-dash-core/config-handler").handle();

module.exports = () => {
  try {
    readdirSync(config.fonts.output).forEach((file) => {
      let resolvedOutPath = path.resolve(config.fonts.output, file);

      if (file.includes("ttf") || file.includes("otf")) {
        let postScriptName = Object.values(
          opentype.loadSync(resolvedOutPath).tables.name.postScriptName
        )[0];

        renameSync(
          resolvedOutPath,
          path.resolve(
            config.fonts.output,
            `./${postScriptName}.${/[^.]+$/.exec(file)[0]}`
          )
        );
      }
    });
  } catch (err) {
    exceptionHandler(err);
  }
};
