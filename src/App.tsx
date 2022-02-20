import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { Keyboard } from "./Keyboard";
import { useDict } from "./useDict";

type Letter = {
  letter: string;
  type: "correct" | "present" | "absent" | "empty";
  position: number;
};
type Wordle = Letter[][];

function initWordle(): Wordle {
  return [
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
    [
      { letter: "", type: "empty", position: 0 },
      { letter: "", type: "empty", position: 1 },
      { letter: "", type: "empty", position: 2 },
      { letter: "", type: "empty", position: 3 },
      { letter: "", type: "empty", position: 4 },
    ],
  ];
}

function App() {
  const [presents, setPresents] = React.useState<Letter[]>([]);
  const [absents, setAbsents] = React.useState<Letter[]>([]);
  const [corrects, setCorrects] = React.useState<Letter[]>([]);
  const [wordle, setWordle] = React.useState<Wordle>(initWordle());
  const [results, setResults] = React.useState<string[]>([]);
  const [row, setRow] = React.useState<number>(0);
  const [lang, setLang] = React.useState<"en" | "tr">(
    navigator.language.includes("tr") ? "tr" : "en"
  );
  const Dict = useDict(lang);

  useEffect(() => {
    // set absents
    const absents = wordle?.flat().filter((letter) => letter.type === "absent");
    setAbsents(absents);

    const notEmptyRows = wordle?.filter((row) =>
      row.some((letter) => letter.type !== "empty")
    );
    // set presents
    const presents = notEmptyRows[notEmptyRows.length - 1]?.filter(
      (letter) => letter.type === "present"
    );
    setPresents(presents);
    // set corrects
    const corrects = notEmptyRows[notEmptyRows.length - 1]?.filter(
      (letter) => letter.type === "correct"
    );
    setCorrects(corrects);
  }, [wordle]);

  const onChar = (letter: string, row: number) => {
    const regex = /^[a-zA-ZğüşöçĞÜŞÖÇı]+$/;
    if (!regex.test(letter)) return;
    // find the first empty box
    const empty = wordle[row].findIndex((x) => x.type === "empty");
    if (empty === -1) return;
    // update the wordle
    const newWordle = [...wordle];
    newWordle[row][empty] = {
      letter,
      type: "absent",
      position: empty,
    };
    setWordle(newWordle);
    // handle backspace and delete keys from wordle
  };

  function onDelete(row: number) {
    const newWordle = [...wordle];
    const notEmpty = newWordle[row].filter((x) => x.letter !== "");
    newWordle[row][notEmpty.length - 1] = {
      letter: "",
      type: "empty",
      position: notEmpty.length - 1,
    };
    setWordle(newWordle);
  }

  function analyze() {
    const r = Dict.words
      .filter((w) => {
        return w.split("").every((letter) => {
          return absents.every((l) => l.letter !== letter);
        });
      })
      .filter((w) => {
        return corrects.every((c, i) => {
          return c.letter === w[c.position];
        });
      })
      .filter((w) => {
        return presents.every((p, i) => {
          return w.includes(p.letter) && w[p.position] !== p.letter;
        });
      });

    //  make it uniq
    const uniq = new Set(r);
    const results = Array.from(uniq);
    setResults(results.sort());
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
              ? "Wordle'da denediginiz kelimeleri girin. harflerin durumunu degistirmek icin uzerine tiklayin."
              : "Type the words you tried on Wordle. Click on any letter to change its status"}
          </p>
          <div className="wordle">
            {wordle.map((row, i) => (
              <div
                tabIndex={i}
                onClick={() => {
                  setRow(i);
                }}
                key={i}
                className="row"
                onKeyDown={(e) => {
                  if (e.code === "Backspace") {
                    onDelete(i);
                  } else {
                    const letter = e.key.toLowerCase();
                    onChar(letter, i);
                  }
                }}
              >
                {row.map((letter, j) => {
                  return (
                    <div
                      key={j}
                      style={{
                        cursor: "pointer",
                      }}
                      className="tile"
                      data-state={letter.type}
                      data-animation="pop"
                      onClick={() => {
                        const newWordle = [...wordle];
                        if (letter.type === "absent") {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: "present",
                            position: j,
                          };
                        } else if (letter.type === "present") {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: "correct",
                            position: j,
                          };
                        } else if (letter.type === "correct") {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: "absent",
                            position: j,
                          };
                        }
                        setWordle(newWordle);
                      }}
                    >
                      {letter.letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <Keyboard
            lang={lang}
            onChar={(v) => onChar(v.toLocaleLowerCase(), row)}
            onDelete={() => onDelete(row)}
          />
          <div className="btn-wrapper">
            <button
              className="analyze-btn"
              onClick={analyze}
              disabled={
                !wordle.some((row) => row.some((x) => x.type !== "empty"))
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
              {results.map((word, i) => (
                <div key={word + i} className="result-item">
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
