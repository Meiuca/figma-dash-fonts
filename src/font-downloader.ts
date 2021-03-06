import chalk from "chalk";
import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import MeiucaEngineCore, { MeiucaEngineError } from "meiuca-engine-core";
import { DirectLink } from "meiuca-engine-core/dist/config-handler";
import axios from "axios";

export default async function (fonts: DirectLink[], core: MeiucaEngineCore) {
  let outPath = path.resolve(process.cwd(), core.config.fonts!.output);

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
      throw new MeiucaEngineError(
        err,
        `Error thrown when fetching ${font.src}`
      );
    }
  });

  await Promise.all(fontDownloadPromises);
}
