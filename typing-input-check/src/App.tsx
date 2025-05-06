import { useState } from "react";

interface StartScreenProps {
  onStart: () => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div>
      <div className="border p-4 mb-4">
        <div className="flex justify-between mb-4">
          <div>
            残り時間 <span className="text-2xl">30</span> 秒
          </div>
          <div>
            打鍵数 <span className="text-2xl">0</span>
          </div>
          <div>
            文字数 <span className="text-2xl">0</span>
          </div>
          <div>
            ミスタッチ <span className="text-2xl text-red-500">0</span>
          </div>
          <div>
            打鍵速度 <span className="text-2xl">0</span> 打鍵/秒
          </div>
        </div>

        <div className="flex items-start mb-4">
          <div className="bg-gray-100 p-4 flex-1">
            <div className="mb-4">
              <p className="text-xl mb-2">運転免許証の更新ができてえらい</p>
              <p className="text-gray-400">
                うんてんめんきょしょうのこうしんができてえらい
              </p>
              <p className="text-gray-400">
                untenmenkkyoshounokoushinngadekiteerai
              </p>
            </div>

            <div className="flex items-center">
              <button className="border px-2 py-1 mr-2">次</button>
              <p>化け物と馬鹿者しかいないじゃないか</p>
            </div>
          </div>
        </div>

        <div className="text-center text-red-500 text-xl">
          画面をクリックしてキー入力をすると開始します
        </div>
      </div>

      <button onClick={onStart} className="w-full">
        クリックしてスタート
      </button>
    </div>
  );
}

interface PlayScreenProps {
  onFinish: () => void;
}

function PlayScreen({ onFinish }: PlayScreenProps) {
  return (
    <div>
      <div className="border border-dashed p-4 mb-4">
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
              <p className="text-xl mb-2">人類は膝から崩れ落ちすぎる</p>
              <p className="text-gray-400">
                じんるいはひざからくずれおちすぎる
              </p>
              <p>
                <span className="text-green-600">jinruiha</span>
                <span className="text-gray-400">hizakarakuzureochisugiru</span>
              </p>
            </div>

            <div className="flex items-center">
              <button className="border px-2 py-1 mr-2">次</button>
              <p>空を飛んでしまった車なら衝撃映像で見た</p>
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      {screen === "start" && <StartScreen onStart={() => setScreen("play")} />}
      {screen === "play" && <PlayScreen onFinish={() => setScreen("result")} />}
      {screen === "result" && (
        <ResultScreen onRestart={() => setScreen("start")} />
      )}
    </div>
  );
}
