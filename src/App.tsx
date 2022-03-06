import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Keyboard } from "./components/Keyboard";
import { LangSwitcher } from "./components/LangSwitcher";
import "./index.scss";
import {
  analyze,
  getAbsents,
  getCorrects,
  getPresents,
  initWordle,
  useDict,
} from "./lib";
import {
  ABSENT,
  CORRECT,
  EMPTY,
  Letter,
  PRESENT,
  Word,
  Wordle,
} from "./lib/types";

export default function App() {
  const [presents, setPresents] = React.useState<Letter[]>([]);
  const [absents, setAbsents] = React.useState<Letter[]>([]);
  const [corrects, setCorrects] = React.useState<Letter[]>([]);
  const [wordle, setWordle] = React.useState<Wordle>(initWordle());
  const [results, setResults] = React.useState<Word[]>([]);
  const [row, setRow] = React.useState<number>(0);
  const [lang, setLang] = React.useState<"en" | "tr">(
    navigator.language.includes("tr") ? "tr" : "en"
  );
  const Dict = useDict(lang);

  useEffect(() => {
    setAbsents(getAbsents(wordle));
    setPresents(getPresents(wordle));
    setCorrects(getCorrects(wordle));
  }, [wordle]);

  const onChar = (letter: string, row: number) => {
    const regex = /^[a-zA-ZğüşöçĞÜŞÖÇı]+$/;
    if (!regex.test(letter)) return;
    // find the first empty box
    const empty = wordle[row].findIndex((x) => x.type === EMPTY);
    if (empty === -1) return;
    // update the wordle
    const newWordle = [...wordle];
    newWordle[row][empty] = {
      letter,
      type: ABSENT,
      position: empty,
    };
    setWordle(newWordle);
  };

  function onDelete(row: number) {
    const newWordle = [...wordle];
    const notEmpty = newWordle[row].filter((x) => x.letter !== "");
    newWordle[row][notEmpty.length - 1] = {
      letter: "",
      type: EMPTY,
      position: notEmpty.length - 1,
    };
    setWordle(newWordle);
  }

  function handleAnalyze() {
    const r = analyze(Dict.words, corrects, absents, presents);
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
                        if (letter.type === ABSENT) {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: PRESENT,
                            position: j,
                          };
                        } else if (letter.type === PRESENT) {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: CORRECT,
                            position: j,
                          };
                        } else if (letter.type === CORRECT) {
                          newWordle[i][j] = {
                            letter: letter.letter,
                            type: ABSENT,
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
              onClick={handleAnalyze}
              disabled={
                !wordle.some((row) => row.some((x) => x.type !== EMPTY))
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
