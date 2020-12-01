const exceptionHandler = require("figma-dash-core/exception-handler");
const config = require("figma-dash-core/config-handler").handle();
const { depth } = require("figma-dash-core/functions");
const { validateFonts } = require("figma-dash-core/validations");
const downloadFonts = require("./src/font-downloader");
const convertLink = require("./src/link-converter");
const parseFonts = require("./src/font-parser");

module.exports = async () => {
  try {
    validateFonts();

    let fonts = [];

    if (config.fonts.files) {
      let parsedFonts = parseFonts(config.fonts.files);

      let convertedLinks = await Promise.all(convertLink(parsedFonts));

      fonts = fonts.concat(convertedLinks);
    }

    if (config.fonts.urls) {
      let convertedLinks = await Promise.all(convertLink(config.fonts.urls));

      fonts = fonts.concat(convertedLinks);
    }

    if (config.fonts.directLinks) {
      fonts = fonts.concat(config.fonts.directLinks);
    }

    fonts = fonts.flat(depth(fonts));

    downloadFonts(fonts);
  } catch (err) {
    exceptionHandler(err, "check figma-dash.config.js");
  }
};
