import { useEffect, useState } from "react";
import { convertBuffer } from "./romantable";

export function Convert() {
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
