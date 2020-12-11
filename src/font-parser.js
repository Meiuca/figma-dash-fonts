const exceptionHandler = require("figma-dash-core/exception-handler");
const { parseDeepObj } = require("figma-dash-core/functions");
const config = require("figma-dash-core/config-handler").handle();

module.exports = (src) => {
  try {
    let fonts = parseDeepObj(require(src));

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
        return to_ret.weight.map((wItem) =>
          config.fonts.provider
            .replace(/\{f\}/g, fItem)
            .replace(/\{w\}/g, wItem)
        );
      })
      .flat(2);
  } catch (err) {
    exceptionHandler(err, "try 'init -f' to update the config file");
  }
};
