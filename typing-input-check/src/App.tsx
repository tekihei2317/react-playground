import { useEffect, useRef, useState } from "react";
import { words } from "./words";
import { initializeChecker } from "./checker";
import { TypingStats, useTypingStats } from "./use-typing-stats";
import { useEffectEvent } from "./use-effect-event";

type WordInputState = {
  currentKana: string;
  currentRoman: string;
  expectedRoman: string;
};
interface PlayScreenProps {
  wordIndex: number;
  wordInputState: WordInputState;
  stats: TypingStats;
  hasMistyped: boolean;
}

function PlayScreen({
  wordIndex,
  wordInputState,
  stats,
  hasMistyped,
}: PlayScreenProps) {
  const word = words[wordIndex];
  const nextWord = words[(wordIndex + 1) % words.length];

  return (
    <div>
      <div className="border p-4 mb-4">
        <div className="flex justify-between mb-4">
          <div>
            残り時間 <span className="text-2xl">{stats.timeLeft}</span> 秒
          </div>
          <div>
            打鍵数 <span className="text-2xl">{stats.keystrokes}</span>
          </div>
          <div>
            文字数 <span className="text-2xl">{stats.totalChars}</span>
          </div>
          <div>
            ミスタッチ{" "}
            <span className="text-2xl text-red-500">{stats.misses}</span>
          </div>
          <div>
            打鍵速度 <span className="text-2xl">{stats.speed}</span> 打鍵/秒
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
                {hasMistyped ? (
                  <>
                    <span className="text-red-400">
                      {wordInputState.expectedRoman.slice(0, 1)}
                    </span>
                    <span className="text-gray-400">
                      {wordInputState.expectedRoman.slice(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">
                    {wordInputState.expectedRoman}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center">
              <button className="border px-2 py-1 mr-2">次</button>
              <p>{nextWord.display}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResultScreenProps {
  onRestart: () => void;
  stats: TypingStats;
}

function ResultScreen({ onRestart, stats }: ResultScreenProps) {
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
                  <td className="text-right text-2xl">{stats.keystrokes}</td>
                </tr>
                <tr>
                  <td>文字数</td>
                  <td className="text-right text-2xl">{stats.totalChars}</td>
                </tr>
                <tr>
                  <td>ミス数</td>
                  <td className="text-right text-2xl">{stats.misses}</td>
                </tr>
                <tr>
                  <td>平均入力打鍵/秒</td>
                  <td className="text-right text-2xl">{stats.speed}</td>
                </tr>
                {/* <tr>
                  <td>瞬間最高打鍵/秒</td>
                  <td className="text-right text-2xl">13</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black p-2"
        >
          再挑戦する（スペースキーまたはEscキー）
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"start" | "play" | "result">("start");
  const [wordIndex, setWordIndex] = useState(0);
  const currentWord = words[wordIndex];
  const checker = useRef(initializeChecker({ word: currentWord.hiragana }));

  const [currentKana, setCurrentKana] = useState<string>("");
  const [currentRoman, setCurrentRoman] = useState<string>("");
  const [expectedRoman, setExpectedRoman] = useState<string>(
    checker.current.expected
  );
  // かなの文字数を計算する用
  const [currentKanaLength, setCurrentKanaLength] = useState<number>(0);
  const [hasMistyped, setHasMistyped] = useState<boolean>(false);

  const restart = useEffectEvent(() => {
    setScreen("start");
    updateStats({ type: "reset" });

    setWordIndex(0);
    checker.current = initializeChecker({ word: words[0].hiragana });
    setCurrentKana("");
    setCurrentRoman("");
    setCurrentKanaLength(0);
    setExpectedRoman(checker.current.expected);
    setHasMistyped(false);
  });

  const handleCorrect = useEffectEvent(() => {
    setCurrentKana(checker.current.currentKana);
    setCurrentRoman(checker.current.currentRoman);
    setExpectedRoman(checker.current.expected);
    updateStats({ type: "correct" });
    if (currentKanaLength != checker.current.currentKana.length) {
      updateStats({ type: "charConfirmed" });
      setCurrentKanaLength(checker.current.currentKana.length);
    }
    setHasMistyped(false);
  });

  const { typingStats: stats, updateTypingStats: updateStats } =
    useTypingStats();

  // キーボード入力を受け取る
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (screen === "start") {
        // キーボード入力を受け取り、正解であればゲームを開始する
        if (("a" <= e.key && e.key <= "z") || e.key === "-") {
          const result = checker.current.setCharacter(e.key);

          if (result.correct) {
            setScreen("play");
            handleCorrect();
          }
        }
      } else if (screen === "play") {
        if (("a" <= e.key && e.key <= "z") || e.key === "-") {
          const result = checker.current.setCharacter(e.key);

          if (result.correct === true) {
            handleCorrect();

            if (checker.current.expected === "") {
              // 最後まで打ったら次のワードへ
              setWordIndex((prev) => (prev + 1) % words.length);

              checker.current = initializeChecker({
                word: words[(wordIndex + 1) % words.length].hiragana,
              });
              setCurrentKana("");
              setCurrentRoman("");
              setExpectedRoman(checker.current.expected);
            }
          } else {
            updateStats({ type: "miss" });
            setHasMistyped(true);
          }
        }
      } else {
        if (e.key === " " || e.key === "Escape") {
          restart();
        }
      }
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [screen, checker, wordIndex, updateStats, restart, handleCorrect]);

  // プレイ開始後、1秒ごとに残り時間と打鍵速度を更新する
  const tickHandler = useEffectEvent(() => {
    if (stats.timeLeft > 0) {
      updateStats({ type: "tick" });

      if (stats.timeLeft === 1) {
        setScreen("result");
      }
    }
  });
  useEffect(() => {
    if (screen === "play") {
      const intervalId = window.setInterval(tickHandler, 1000);

      return () => window.clearInterval(intervalId);
    }
    // TODO:
  }, [screen, tickHandler]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {(screen === "start" || screen === "play") && (
        <PlayScreen
          wordIndex={wordIndex}
          wordInputState={{ currentKana, currentRoman, expectedRoman }}
          stats={stats}
          hasMistyped={hasMistyped}
        />
      )}
      {screen === "result" && (
        <ResultScreen onRestart={() => restart()} stats={stats} />
      )}
    </div>
  );
}
