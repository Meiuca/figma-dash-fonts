const chalk = require("chalk");
const path = require("path");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const exceptionHandler = require("figma-dash-core/exception-handler");
const axios = require("axios").default;
const { spawn } = require("child_process");
const { tab } = require("figma-dash-core/functions");
const fontNameCorrector = require("./font-name-corrector");
const config = require("figma-dash-core/config-handler").handle();

function link() {
  console.log(
    chalk.greenBright("\ninfo"),
    "Running",
    chalk.blueBright(config.fonts.linkCommand)
  );

  let [command, ...args] = config.fonts.linkCommand.split(" ");

  let packageManager = spawn(command, args, {
    shell: process.env.OS && process.env.OS.includes("Windows"),
  });

  packageManager.stdout.on("data", (chunk) => {
    console.log(tab(1), chunk.toString("utf-8").replace("\n", ""));
  });

  packageManager.stderr.on("data", (chunk) =>
    exceptionHandler(new Error(chunk.toString("utf-8")))
  );

  packageManager.on("error", exceptionHandler);

  packageManager.on("close", (code) =>
    console.log("\nYarn executed with exit code " + code)
  );
}

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
      exceptionHandler(err, `error thrown when fetching ${font.src}`);
    }
  });

  await Promise.all(fontDownloadPromises);

  fontNameCorrector();

  if (config.fonts.linkCommand) link();
};
