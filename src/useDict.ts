type Lang = "en" | "tr";
type Dict = { words: string[] };

export function useDict(lang: Lang): Dict {
  switch (lang) {
    case "en":
      return require("./data/en.json");
    case "tr":
      return require("./data/tr.json");
    default:
      return require("./data/en.json");
  }
}
