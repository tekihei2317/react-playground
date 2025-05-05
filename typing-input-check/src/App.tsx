import { useEffect, useState } from "react";
import { convertRoman, searchEntriesByPrefix, searchEntry } from "./romantable";

function convertBuffer(buffer: string): { buffer: string; output: string } {
  const entry = searchEntry(buffer);
  const prefixEntries = searchEntriesByPrefix(buffer);

  if (entry) {
    if (prefixEntries.length <= 1) {
      // 変換ルールが1つしかない場合、そのルールを使って変換する
      return {
        output: entry.output,
        buffer: entry.nextInput ? entry.nextInput : "",
      };
    } else {
      // バッファの文字で始まる変換ルールが複数ある場合は、変換を保留する（例: buffer=nのとき、nかnnかnaか分からない）
      return { buffer, output: "" };
    }
  } else {
    if (prefixEntries.length === 0) {
      // bufferはこれから変換される可能性はないので、区切って変換を完了させる
      // |buffer|-1文字と、1文字の2つに分けて変換すればいいっぽい
      const left = buffer.slice(0, buffer.length - 1);
      const right = buffer.slice(buffer.length - 1);

      // 左半分を変換する。本当は右半分も変換して、変換できなかった場合はバッファに入れる必要がある。
      // ここで変換していないのは、ローマ字には1文字で変換されるものがaiueoしかなく、
      // アルファベットの入力のみであれば他の文字+aiueoは全てルールに従って変換されるため。
      // 例えば記号も入力する場合は、";a"などを";あ"に変換する必要があるので、ここで変換が必要。
      // 他にも、例えば"na"→"な"というルールがなければ、"na"をここで"んあ"に変換する必要がある。
      return { output: convertRoman(left), buffer: right };
    } else {
      // 同じく変換を保留する
      return { buffer, output: "" };
    }
  }
}

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

        const { output, buffer: newBuffer } = convertBuffer(buffer + e.key);
        setConvertedText((prev) => prev + output);
        setBuffer(newBuffer);
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
