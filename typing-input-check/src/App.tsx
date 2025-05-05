import { useEffect, useState } from "react";
import { convertRoman, searchEntriesByPrefix, searchEntry } from "./romantable";

function App() {
  const [input, setInput] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [buffer, setBuffer] = useState<string>("");

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // アルファベットと-の入力を受け取る
      if (("a" <= e.key && e.key <= "z") || e.key === "-") {
        setText((text) => text + e.key);

        const newBuffer = buffer + e.key;
        setBuffer(newBuffer);

        // ここに変換のロジックを書く

        const entry = searchEntry(newBuffer);
        const prefixEntries = searchEntriesByPrefix(newBuffer);
        // 変換ルールが見つかったら即時変換してみる
        if (entry) {
          if (prefixEntries.length <= 1) {
            // 変換ルールがentryしかない場合、entryを使って変換する
            setBuffer(entry.nextInput ? entry.nextInput : "");
            setConvertedText((prev) => prev + entry.output);
          } else {
            // bufferから始まる変換ルールが複数ある場合は、変換を保留する
          }
        } else {
          // TODO:
          if (prefixEntries.length === 0) {
            // bufferはこれから変換される可能性はないので、区切って変換を完了させる
            // |buffer|-1文字と、1文字の2つに分けて変換すればいいっぽい
            const left = newBuffer.slice(0, newBuffer.length - 1);
            const right = newBuffer.slice(newBuffer.length - 1);
            console.log({ left, right });

            // 左半分を変換する
            setConvertedText((prev) => prev + convertRoman(left));

            // 本当は右半分も変換する必要があるが、ローマ字には1文字で変換されるものがaiueoしかなく、
            // アルファベットの入力のみであれば他の文字+aiueoは全てルールに従って変換されるので、ここでは考慮しなくてよい。
            // 例えば記号も入力する場合は、";a"などを";あ"に変換する必要があるので、ここで変換が必要。
            // 他にも、例えば"na"→"な"というルールがなければ、"na"をここで"んあ"に変換する必要がある。
            setBuffer(right);
          }
        }
      }
      if (e.key === "Backspace" || e.key === "Enter") {
        setInput("");
        setText("");
        setBuffer("");
        setConvertedText("");
      }
    };
    window.addEventListener("keydown", handle);

    return () => window.removeEventListener("keydown", handle);
  }, [buffer]);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px" }}>
        <div style={{ minHeight: "1.5em" }}>{text}</div>
        <div style={{ minHeight: "1.5em" }}>
          {convertedText}
          {buffer}
        </div>
        <div>変換済み: {convertedText}</div>
        <div>変換中: {buffer}</div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
    </div>
  );
}

export default App;
