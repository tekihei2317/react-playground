import { useEffect, useReducer, useRef, useState } from "react";
import { words } from "./words";
import { initializeChecker } from "./checker";

type WordInputState = {
  currentKana: string;
  currentRoman: string;
  expectedRoman: string;
};
interface PlayScreenProps {
  onFinish: () => void;
  wordIndex: number;
  wordInputState: WordInputState;
}

function PlayScreen({ onFinish, wordIndex, wordInputState }: PlayScreenProps) {
  const word = words[wordIndex];
  const nextWord = words[(wordIndex + 1) % words.length];
  console.log({ wordInputState });

  return (
    <div>
      <div className="border p-4 mb-4">
        <div className="flex justify-between mb-4">
          <div>
            残り時間 <span className="text-2xl">15</span> 秒
          </div>
          <div>
            打鍵数 <span className="text-2xl">43</span>
          </div>
          <div>
            文字数 <span className="text-2xl">23</span>
          </div>
          <div>
            ミスタッチ <span className="text-2xl text-red-500">1</span>
          </div>
          <div>
            打鍵速度 <span className="text-2xl">2.9</span> 打鍵/秒
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-gray-100 p-4 flex-1">
            <div className="mb-4">
              <p className="text-xl mb-2">{word.display}</p>
              <p>
                <span className="text-blue-400">
                  {word.hiragana.slice(0, wordInputState.currentKana.length)}
                </span>
                <span className="text-gray-400">
                  {word.hiragana.slice(wordInputState.currentKana.length)}
                </span>
              </p>
              <p>
                <span className="text-green-600">
                  {wordInputState.currentRoman}
                </span>
                <span className="text-gray-400">
                  {wordInputState.expectedRoman}
                </span>
              </p>
            </div>

            <div className="flex items-center">
              <button className="border px-2 py-1 mr-2">次</button>
              <p>{nextWord.display}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onFinish} className="w-full">
        タイピング終了（デモ用）
      </button>
    </div>
  );
}

interface ResultScreenProps {
  onRestart: () => void;
}

function ResultScreen({ onRestart }: ResultScreenProps) {
  return (
    <div>
      <div className="bg-white border border-gray-200 p-4 mb-4">
        <h1 className="text-4xl font-bold text-center mb-6">結果</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td>打鍵数</td>
                  <td className="text-right text-2xl">318</td>
                </tr>
                <tr>
                  <td>文字数</td>
                  <td className="text-right text-2xl">183</td>
                </tr>
                <tr>
                  <td>ミス数</td>
                  <td className="text-right text-2xl">6</td>
                </tr>
                <tr>
                  <td>平均入力打鍵/秒</td>
                  <td className="text-right text-2xl">10.6</td>
                </tr>
                <tr>
                  <td>瞬間最高打鍵/秒</td>
                  <td className="text-right text-2xl">13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black"
        >
          再挑戦する（スペースキーまたはEscキー）
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"start" | "play" | "result">("start");
  const [wordIndex, goToNextWord] = useReducer(
    (index) => (index + 1) % words.length,
    0
  );
  const currentWord = words[wordIndex];
  const checker = useRef(initializeChecker({ word: currentWord.hiragana }));

  const [currentKana, setCurrentKana] = useState<string>("");
  const [currentRoman, setCurrentRoman] = useState<string>("");
  const [expectedRoman, setExpectedRoman] = useState<string>(
    checker.current.expected
  );

  useEffect(() => {
    // キーボード入力を受け取る
    const handle = (e: KeyboardEvent) => {
      if (screen === "start") {
        // キーボード入力を受け取り、正解であればプレイ可能な状態にする
        if (("a" <= e.key && e.key <= "z") || e.key === "-") {
          const result = checker.current.setCharacter(e.key);

          if (result.correct) {
            // ゲーム開始
            setScreen("play");
            setCurrentKana(checker.current.currentKana);
            setCurrentRoman(checker.current.currentRoman);
            setExpectedRoman(checker.current.expected);
          }
        }
      } else if (screen === "play") {
        // キーボード入力を受け取る
        if (("a" <= e.key && e.key <= "z") || e.key === "-") {
          const result = checker.current.setCharacter(e.key);

          if (result.correct === true) {
            setCurrentKana(checker.current.currentKana);
            setCurrentRoman(checker.current.currentRoman);
            setExpectedRoman(checker.current.expected);

            if (checker.current.expected === "") {
              // 最後まで打ったら次のワードへ
              goToNextWord();

              checker.current = initializeChecker({
                word: words[(wordIndex + 1) % words.length].hiragana,
              });
              setCurrentKana("");
              setCurrentRoman("");
              setExpectedRoman(checker.current.expected);
            }
          }
        }
      } else {
        if (e.key === "Space") {
          setScreen("start");
        }
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [screen, checker, wordIndex]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {(screen === "start" || screen === "play") && (
        <PlayScreen
          onFinish={() => setScreen("result")}
          wordIndex={wordIndex}
          wordInputState={{ currentKana, currentRoman, expectedRoman }}
        />
      )}
      {screen === "result" && (
        <ResultScreen onRestart={() => setScreen("start")} />
      )}
    </div>
  );
}
