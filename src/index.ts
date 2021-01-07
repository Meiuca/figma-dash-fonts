import FigmaDashCore from "figma-dash-core";
import downloadFonts from "./font-downloader";
import correctFontName from "./font-name-corrector";
import convertLink from "./link-converter";
import parseFonts from "./font-parser";
import path from "path";
import link from "./linker";

export default async function (core?: FigmaDashCore) {
  if (!core) core = new FigmaDashCore();

  try {
    core.validations.validateFonts();

    let fonts: {
      src: string;
      local: string;
    }[] = [];

    if (!core.config.fonts) return;

    if (core.config.fonts.files) {
      let parsedFonts = parseFonts(
        path.resolve(core.config.figma.output, "./tokens.json"),
        core
      );

      let convertedLinks = await Promise.all(convertLink(parsedFonts));

      fonts = fonts.concat(
        convertedLinks.flat(
          core.functions.depth(convertedLinks)
        ) as typeof fonts
      );
    }

    if (core.config.fonts.urls) {
      let convertedLinks = await Promise.all(
        convertLink(core.config.fonts.urls)
      );

      fonts = fonts.concat(
        convertedLinks.flat(
          core.functions.depth(convertedLinks)
        ) as typeof fonts
      );
    }

    if (core.config.fonts.directLinks) {
      fonts = fonts.concat(core.config.fonts.directLinks);
    }

    await downloadFonts(fonts, core);

    correctFontName(core);

    if (core.config.fonts.linkCommand) await link(core);
  } catch (err) {
    throw new FigmaDashCore.FigmaDashError(err, "Check the config file");
  }
}
