import css, { Declaration, FontFace } from "css";
import FigmaDashCore from "figma-dash-core";
import axios from "axios";

const safeStringArray = ["error", "error"];

function cssMapper(rule: FontFace) {
  let font: string[] = [];

  if (!rule.declarations) return;

  rule.declarations
    .filter((item: Declaration) => item.property == "src")
    .forEach((declaration: Declaration) => {
      let urlRegExp = /url\(([^)]+)/;

      let src = (urlRegExp.exec(declaration.value!) || safeStringArray)[1]!;

      let srcWithoutQuote = src.replace(/'/g, "");

      font.push(srcWithoutQuote);
    });

  rule.declarations
    .filter((item: Declaration) => item.property == "font-family")
    .forEach((declaration: Declaration) => {
      let fontFamily = (declaration.value || "empty").replace(/\s/g, "-");

      let fontFamilyWithoutQuote = fontFamily.replace(/'/g, "");

      let fontWeight = ((rule.declarations as Declaration[]).filter(
        (item) => item.property == "font-weight"
      ) || safeStringArray)[0]!.value;

      let fontStyle = (rule.declarations as Declaration[]).filter(
        (item) => item.property == "font-style"
      )[0]!.value;

      font.push(fontFamilyWithoutQuote + fontWeight + fontStyle);
    });

  return {
    src: font[0]!,
    local: font[1] + "." + (/[^.]+$/.exec(font[0]!) || ["n"])[0],
  };
}

export default function (urls: string[]) {
  return urls.map(async (url) => {
    try {
      let { data } = await axios.get(url);

      let cssObj = css.parse(data);

      return (cssObj.stylesheet?.rules || []).map(cssMapper);
    } catch (err) {
      throw new FigmaDashCore.FigmaDashError(
        err,
        `error thrown when fetching ${url}`
      );
    }
  });
}
