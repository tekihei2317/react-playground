import { expect, test } from "vitest";
import { romanTable, TableEntry } from "./romantable";

type CheckResult = {
  correct: boolean;
  expected: string;
  current: string;
  currentKana: string;
};

type Checker = {
  expected: string;
  setCharacter: (character: string) => CheckResult;
};

/**
 * ワードに対して、予想されるローマ字の文字列を作成する
 */
function createExpectedInput(word: string): string {
  // 文字列を前から順番に見ていって、最長一致するものを選択していく

  let index = 0;
  const entries: TableEntry[] = [];

  while (index < word.length) {
    console.log({ index });

    let candidate: TableEntry | undefined;

    romanTable.forEach((entry) => {
      if (entry.output === word.slice(index, index + entry.output.length)) {
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
    console.log({ candidate });
  }

  console.log(entries);

  return entries.map((entry) => entry.input).join("");
}

function initializeChecker({ word }: { word: string }): Checker {
  let converted = "";
  let buffer = "";
  let expected = "";

  const checker: Checker = {
    get expected(): string {
      return expected;
    },
    setCharacter(character): CheckResult {
      converted += character;

      return {
        correct: true,
        expected: "",
        current: converted,
        currentKana: "",
      };
    },
  };

  return checker;
}

test("createExpectedInput", () => {
  const expected = createExpectedInput("こんにちは");

  expect(expected).toBe("konnnitiha");
});

test.skip("checker wrong input", () => {
  const checker = initializeChecker({ word: "こんにちは" });
  expect(checker.expected).toBe("konnnitiha");

  const result = checker.setCharacter("a");
  expect(result).toEqual({
    correct: false,
    expected: "konnnitiha",
    current: "",
    currentKana: "",
  });
});

test.skip("checker correct input", () => {
  const checker = initializeChecker({ word: "こんにちは" });
  expect(checker.expected).toBe("konnnitiha");

  const result = checker.setCharacter("k");
  expect(result).toEqual({
    correct: true,
    expected: "onnnitiha",
    current: "k",
    currentKana: "k",
  });

  const result2 = checker.setCharacter("o");
  expect(result2).toEqual({
    correct: true,
    expected: "nnitiha",
    current: "ko",
    currentKana: "こ",
  });
});
