import { ABSENT, CORRECT, EMPTY, Letter, PRESENT, Word, Wordle } from "./types";

export function getNotEmptyRows(wordle: Wordle): Letter[][] {
  return wordle?.filter((row) => row.some((letter) => letter.type !== EMPTY));
}

export function getAbsents(wordle: Wordle): Letter[] {
  return wordle?.flat().filter((letter) => letter.type === ABSENT);
}

export function getPresents(wordle: Wordle): Letter[] {
  const notEmptyRows = getNotEmptyRows(wordle);
  return notEmptyRows?.flat().filter((letter) => letter.type === PRESENT);
}

export function getCorrects(wordle: Wordle): Letter[] {
  const notEmptyRows = getNotEmptyRows(wordle);
  return notEmptyRows[notEmptyRows.length - 1]?.filter(
    (letter) => letter.type === CORRECT
  );
}

export function handleDeleteFromRow(row: number, wordle: Wordle): Wordle {
  const newWordle = [...wordle];
  const notEmpty = newWordle[row].filter((x) => x.letter !== "");
  newWordle[row][notEmpty.length - 1] = {
    letter: "",
    type: EMPTY,
    position: notEmpty.length - 1,
  };
  return newWordle;
}

export function filterCorrects(word: Word, corrects: Letter[]): boolean {
  return corrects.every((c, i) => {
    return c.letter === word[c.position];
  });
}

export function filterAbsents(
  word: Word,
  absents: Letter[],
  corrects: Letter[]
): boolean {
  return word.split("").every((letter, i) => {
    return absents.every((l) => {
      if (l.letter === letter) {
        const corr = corrects.find((c) => c.letter === l.letter);
        if (corr) {
          return l.position !== corr.position && i !== l.position;
        }
      }
      return l.letter !== letter;
    });
  });
}

export function filterPresents(word: Word, presents: Letter[]): boolean {
  return presents.every((p) => {
    return word.includes(p.letter) && word[p.position] !== p.letter;
  });
}

export function analyze(
  words: Word[],
  corrects: Letter[],
  absents: Letter[],
  presents: Letter[]
): Word[] {
  const r = words
    .filter((w) => filterCorrects(w, corrects))
    .filter((w) => filterAbsents(w, absents, corrects))
    .filter((w) => filterPresents(w, presents));

  const uniq = new Set(r);
  return Array.from(uniq).sort();
}

export function initWordle(): Wordle {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, (_, i) => ({
      letter: "",
      type: EMPTY,
      position: i,
    }))
  );
}
