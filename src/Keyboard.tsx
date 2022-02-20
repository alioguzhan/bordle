import { Key } from "./Key";

type Props = {
  onChar: (value: string) => void;
  onDelete: () => void;
  isRevealing?: boolean;
  lang: "tr" | "en";
};

export const Keyboard = ({ lang, onChar, onDelete, isRevealing }: Props) => {
  const onClick = (value: string) => {
    if (value === "DELETE") {
      onDelete();
    } else {
      if (value === "İ") {
        onChar("i");
      } else if (value === "I") {
        onChar("ı");
      } else {
        onChar(value);
      }
    }
  };

  const DELETE_TEXT = lang === "tr" ? "Sil" : "Delete";

  return (
    <div
      style={{}}
      onKeyDown={(e) => {
        if (e.code === "Backspace") {
          onDelete();
        } else {
          const key = e.key.toUpperCase();
          if (key.length === 1 && key >= "A" && key <= "Z") {
            onChar(key);
          }
        }
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
      >
        {(lang === "tr"
          ? ["E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"]
          : ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
        ).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
      >
        {(lang === "tr"
          ? ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"]
          : ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
        ).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            isRevealing={isRevealing}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {(lang === "tr"
          ? ["Z", "C", "V", "B", "N", "M", "Ö", "Ç"]
          : ["Z", "X", "C", "V", "B", "N", "M"]
        ).map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            isRevealing={isRevealing}
          />
        ))}
        <Key width={65.4} value="DELETE" onClick={onClick}>
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  );
};
