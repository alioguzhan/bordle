import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useDict } from "./useDict";

function App() {
  const [presents, setPresents] = React.useState<string[]>([]);
  const [absents, setAbsents] = React.useState<string[]>([]);
  const [word, setWord] = React.useState<string[]>(["", "", "", "", ""]);
  const [results, setResults] = React.useState<string[]>([]);

  const absentRef = React.useRef<HTMLInputElement>(null);
  const presentRef = React.useRef<HTMLInputElement>(null);
  const [lang, setLang] = React.useState<"en" | "tr">(
    navigator.language.includes("tr") ? "tr" : "en"
  );
  const Dict = useDict(lang);

  function analyze() {
    const r = Dict.words
      .filter((w) => {
        return w.split("").every((letter) => !absents.includes(letter));
      })
      .filter((w) => {
        return word.every((c, i) => {
          if (c === "") return true;
          if (c === w[i]) return true;
          return false;
        });
      })
      .filter((w) => {
        return presents.every((x) => w.includes(x));
      });

    setResults(r);
  }

  return (
    <div className="App">
      <ToastContainer position="top-center" />
      <header className="fixed-header">
        <div></div>
        <div className="logo-wrapper">
          <a className="logo" href="/">
            BORDLE
          </a>
          <p style={{ marginLeft: 20 }}>
            {lang === "tr"
              ? "turkce wordle icin yardimci"
              : "helper for wordle"}
          </p>
        </div>

        <LangSwitcher lang={lang} onChange={setLang} />
      </header>
      <main>
        <div className="panel">
          <p>
            {lang === "tr"
              ? "herhangi bi alana harf eklemek icin beyaz kutunun icine harfi yazin ve kutunun disina tiklayin."
              : "To add a letter to any section below, click on white boxes and type it and click outside."}
          </p>
          <div className="blacklist-letters">
            <h3>{lang === "tr" ? "Bulunmayan Harfler" : "Absent Letters"}</h3>

            <div
              className="row"
              style={{ gridTemplateColumns: "repeat(auto-fit, 50px)" }}
            >
              {absents.map((letter) => (
                <div
                  key={letter}
                  className="tile"
                  data-state="absent"
                  data-animation="pop"
                  style={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const newAbsents = absents.filter((x) => x !== letter);
                    setAbsents(newAbsents);
                    absentRef.current?.focus();
                  }}
                >
                  {letter}
                </div>
              ))}

              <input
                autoFocus
                ref={absentRef}
                type="text"
                maxLength={1}
                className="tile"
                style={{ color: "#000", textAlign: "center", width: 50 }}
                onBlur={() => {
                  const letter = absentRef.current!.value?.toLocaleLowerCase();
                  if (letter.length === 1) {
                    if (word.includes(letter) || presents.includes(letter)) {
                      absentRef.current!.value = "";
                      toast.warn(`${letter} is already in the word or present`);
                      return;
                    }
                    setAbsents((prev) =>
                      Array.from(new Set([...prev, letter]))
                    );
                    absentRef.current!.value = "";
                  }
                }}
              />
            </div>
          </div>

          <div className="present-letters">
            <h3>{lang === "tr" ? "Varolan Harfler" : "Present Letters"}</h3>

            <div
              className="row"
              style={{ gridTemplateColumns: "repeat(auto-fit, 50px)" }}
            >
              {presents.map((letter) => (
                <div
                  key={letter}
                  className="tile"
                  data-state="present"
                  data-animation="pop"
                  style={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const newPresents = presents.filter((x) => x !== letter);
                    setPresents(newPresents);
                    presentRef.current?.focus();
                  }}
                >
                  {letter}
                </div>
              ))}
              <input
                ref={presentRef}
                type="text"
                maxLength={1}
                className="tile"
                style={{ color: "#000", textAlign: "center", width: 50 }}
                onBlur={() => {
                  const letter = presentRef.current!.value?.toLocaleLowerCase();
                  if (letter.length === 1) {
                    if (word.includes(letter) || absents.includes(letter)) {
                      toast.warn(
                        "This letter is already in the word or absent"
                      );
                      presentRef.current!.value = "";
                      return;
                    }
                    setPresents((prev) =>
                      Array.from(new Set([...prev, letter]))
                    );
                    presentRef.current!.value = "";
                  }
                }}
              />
            </div>
          </div>

          <div className="correct-letters">
            <h3>{lang === "tr" ? "Dogru Harfler" : "Correct Letters"}</h3>
            <div
              className="row"
              style={{ gridTemplateColumns: "repeat(auto-fit, 50px)" }}
            >
              {word.map((letter, i) => (
                <input
                  key={letter + i}
                  type="text"
                  maxLength={1}
                  value={letter}
                  className="tile"
                  data-state={letter !== "" ? "correct" : "empty"}
                  data-animation={letter !== "" ? "pop" : "flip-out"}
                  style={{
                    textAlign: "center",
                    width: 50,
                    height: 50,
                    border: "none",
                  }}
                  onChange={(e) => {
                    const letter = e.target.value.toLocaleLowerCase();
                    if (presents.includes(letter) || absents.includes(letter)) {
                      toast.warn(`${letter} is already in the word or absent`);
                      return;
                    }
                    setWord((prev) => {
                      const newWord = [...prev];
                      newWord[i] = letter;
                      return newWord;
                    });
                  }}
                />
              ))}
            </div>
          </div>
          <div className="btn-wrapper">
            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={
                presents.length === 0 &&
                absents.length === 0 &&
                word.every((x) => x === "")
              }
            >
              {lang === "tr" ? "Analiz Et" : "Analyze"}
            </button>
          </div>
        </div>
        <div className="results">
          <div className="result-count">
            {results.length > 0 ? (
              results.length > 500 ? (
                lang === "tr" ? (
                  `cok fazla sonuc var (${results.length}). Sayfa donmasin diye gostermiyorum. biraz daha azaltmaya calis.`
                ) : (
                  `Too many results (${results.length}). I can't show them all. Try to reduce the number of words.`
                )
              ) : (
                <>
                  <strong>{results.length}</strong>
                  {lang === "tr" ? " kelime bulundu : " : " words found : "}
                </>
              )
            ) : (
              <span>{lang === "tr" ? "Sonuc yok" : "No results"}</span>
            )}
          </div>
          {results.length < 501 && (
            <div className="result-list">
              {results.map((word) => (
                <div key={word} className="result-item">
                  {word}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

type LangProps = {
  lang: "tr" | "en";
  onChange: (lang: "tr" | "en") => void;
};
function LangSwitcher({ lang = "tr", onChange }: LangProps) {
  return (
    <div className="lang-switcher">
      {lang === "tr" ? (
        <div className={`lang-btn`} onClick={() => onChange("en")}>
          Switch to En 🏴󠁧󠁢󠁥󠁮󠁧󠁿
        </div>
      ) : (
        <div className={`lang-btn`} onClick={() => onChange("tr")}>
          🇹🇷 Turkceye Gec
        </div>
      )}
    </div>
  );
}

export default App;
