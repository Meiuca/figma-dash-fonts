const chalk = require("chalk");
const path = require("path");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const exceptionHandler = require("figma-dash-core/exception-handler");
const axios = require("axios").default;
const fontNameCorrector = require("./font-name-corrector");
const link = require("./linker");
const config = require("figma-dash-core/config-handler").handle();

module.exports = async (fonts) => {
  let outPath = path.resolve(process.cwd(), config.fonts.output);

  if (!existsSync(outPath)) mkdirSync(outPath, { recursive: true });

  let fontDownloadPromises = fonts.map(async (font) => {
    let out = path.resolve(outPath, `./${font.local}`);

    console.log(
      chalk.greenBright("\ninfo"),
      "Downloading from",
      chalk.gray(font.src)
    );

    try {
      let { data } = await axios.get(font.src, {
        responseType: "arraybuffer",
      });

      writeFileSync(out, data);
    } catch (err) {
      exceptionHandler(err, `Error thrown when fetching ${font.src}`);
    }
  });

  await Promise.all(fontDownloadPromises);

  fontNameCorrector();

  if (config.fonts.linkCommand) {
    try {
      await link();
    } catch (err) {
      exceptionHandler(err);
    }
  }
};
