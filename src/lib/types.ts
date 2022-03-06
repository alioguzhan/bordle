export type Letter = {
  letter: string;
  type: "absent" | "correct" | "present" | "empty";
  position: number;
};

export type Wordle = Letter[][];

export type Word = string;

export type LangProps = {
  lang: "tr" | "en";
  onChange: (lang: "tr" | "en") => void;
};

export const ABSENT = "absent";
export const CORRECT = "correct";
export const PRESENT = "present";
export const EMPTY = "empty";
