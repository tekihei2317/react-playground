import {
  convertRoman,
  romanTable,
  searchEntriesByPrefix,
  searchEntry,
  TableEntry,
} from "./romantable";

export type CheckResult = {
  correct: boolean;
};

export type Checker = {
  expected: string;
  currentRoman: string;
  currentKana: string;

  /**
   * 文字が正しい入力であればセットする
   */
  setCharacter: (character: string) => CheckResult;
};

/**
 * ワードに対して、予想されるローマ字の文字列を作成する
 */
export function createExpectedInput(word: string): string {
  // 文字列を前から順番に見ていって、最長一致するものを選択していく

  let index = 0;
  const entries: TableEntry[] = [];

  while (index < word.length) {
    let candidate: TableEntry | undefined;

    romanTable.forEach((entry) => {
      if (entry.output === word.slice(index, index + entry.output.length)) {
        // TODO: entry.nextInputがある場合は、それを次の文字に合致させられなければならない

        // 最長一致の中で、最初に一致したものを選択する
        if (
          candidate === undefined ||
          entry.output.length > candidate.output.length
        ) {
          candidate = entry;
        }
      }
    });

    // 変換ルールが存在しなかった場合（記号などがある場合は実装が必要）
    if (!candidate) {
      throw new Error(`${word.slice(index)} を変換できません`);
    }
    entries.push(candidate);
    index += candidate.output.length;
  }

  return entries.map((entry) => entry.input).join("");
}

export function initializeChecker({ word }: { word: string }): Checker {
  let buffer = "";
  let expected = createExpectedInput(word);
  let wordIndex = 0;
  let currentKana = "";
  let currentRoman = "";

  const checker: Checker = {
    get expected(): string {
      return expected;
    },
    get currentRoman(): string {
      return currentRoman;
    },
    get currentKana(): string {
      return currentKana;
    },

    setCharacter(character): CheckResult {
      // 変換できる場合→変換後の文字が、ワードに合致していればOK
      // 変換できない場合→今後、ワードに一致させられる場合はOK
      // 消極的に変換する場合→左側の変換後がワードの現在位置に一致していて、かつ右側がワードに一致させられる場合はOK

      const tempBuffer = buffer + character;

      const entry = searchEntry(tempBuffer);
      const prefixEntries = searchEntriesByPrefix(tempBuffer);

      if (prefixEntries.length >= 2) {
        // 変換できない場合

        const entry = prefixEntries.find((entry) => {
          const isOutputCorrect =
            entry.output ===
            word.slice(wordIndex, wordIndex + entry.output.length);

          let isNextInputCorrect = true;
          if (entry.nextInput) {
            const index = wordIndex + entry.output.length;
            isNextInputCorrect = searchEntriesByPrefix(entry.nextInput).some(
              (e) => e.output === word.slice(index, index + e.output.length)
            );
          }

          return isOutputCorrect && isNextInputCorrect;
        });

        if (entry !== undefined) {
          // characterは正解
          buffer = tempBuffer;
          currentRoman += character;
          // TODO: expectedを更新する

          return { correct: true };
        } else {
          return { correct: false };
        }
      } else {
        if (entry) {
          // 変換ルールがある場合は、変換後の文字列がワードに一致させられるならばOK
          // TODO: entry.nextInputに関する処理
          if (
            entry.output ===
            word.slice(wordIndex, wordIndex + entry.output.length)
          ) {
            buffer = entry.nextInput ? entry.nextInput : "";
            currentRoman += character;
            currentKana += entry.output;
            wordIndex += entry.output.length;

            return { correct: true };
          } else {
            return { correct: false };
          }
        } else if (prefixEntries.length === 0) {
          // bufferが今後変換されることはない場合
          // |buffer|-1文字と、1文字に分けて処理する

          const left = tempBuffer.slice(0, tempBuffer.length - 1);
          const right = tempBuffer.slice(tempBuffer.length - 1);

          const leftConverted = convertRoman(left);
          const isLeftCorrect =
            leftConverted ===
            word.slice(wordIndex, wordIndex + leftConverted.length);

          const isRightCorrect = romanTable
            .filter((entry) => {
              return entry.input.startsWith(right);
            })
            .some(
              (entry) =>
                entry.output ===
                word.slice(
                  wordIndex + leftConverted.length,
                  wordIndex + leftConverted.length + entry.output.length
                )
            );

          if (isLeftCorrect && isRightCorrect) {
            buffer = right;
            currentRoman += character;
            currentKana += leftConverted;
            wordIndex += leftConverted.length;
            // TODO: expectedを更新する

            return { correct: true };
          } else {
            return { correct: false };
          }
        }
      }

      return { correct: true };
    },
  };

  return checker;
}
