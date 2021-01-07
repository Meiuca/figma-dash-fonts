import FigmaDashCore from "figma-dash-core";

export default function (src: string, core: FigmaDashCore) {
  try {
    let fonts = core.functions.parseDeepObj(require(src));

    let to_ret: { family: string[]; weight: string[] } = {
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
          (core.config.fonts?.provider || "")
            .replace(/\{f\}/g, fItem)
            .replace(/\{w\}/g, wItem)
        );
      })
      .flat(2);
  } catch (err) {
    throw new FigmaDashCore.FigmaDashError(
      err,
      "try 'init -f' to reset the config file"
    );
  }
}