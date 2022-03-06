import { LangProps } from "../lib/types";

export function LangSwitcher({ lang = "tr", onChange }: LangProps) {
  return (
    <div className="lang-switcher">
      {lang === "tr" ? (
        <div className={`lang-btn`} onClick={() => onChange("en")}>
          Switch to EN 🏴󠁧󠁢󠁥󠁮󠁧󠁿
        </div>
      ) : (
        <div className={`lang-btn`} onClick={() => onChange("tr")}>
          🇹🇷 Turkceye Gec
        </div>
      )}
    </div>
  );
}
