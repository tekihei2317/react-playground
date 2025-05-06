import { describe, expect, test } from "vitest";
import { CheckResult, createExpectedInput, initializeChecker } from "./checker";

describe("createExpectedInput", () => {
  test("『こんにちは』の入力候補を生成する", () => {
    const expected = createExpectedInput("こんにちは");
    expect(expected).toBe("konnnitiha");
  });

  test.skip("『たった』の入力候補を生成する", () => {
    const expected = createExpectedInput("たった");
    expect(expected).toBe("tatta");
  });
});

describe("checker 「か」の場合", () => {
  test("kaを入力すると正解になること", () => {
    const checker = initializeChecker({ word: "か" });
    const result = checker.setCharacter("k");
    const expected: CheckResult = { correct: true };

    expect(result).toEqual(expected);
    expect(checker.currentRoman).toBe("k");

    const result2 = checker.setCharacter("a");
    const expected2: CheckResult = { correct: true };

    expect(result2).toEqual(expected2);
    expect(checker.currentRoman).toBe("ka");
  });

  test("sを入力すると間違いになること", () => {
    const checker = initializeChecker({ word: "か" });
    const expected: CheckResult = { correct: false };

    const result = checker.setCharacter("s");
    expect(result).toEqual(expected);
    expect(checker.currentRoman).toBe("");
  });

  test("tを入力すると間違いになること", () => {
    const checker = initializeChecker({ word: "か" });
    const expected: CheckResult = { correct: false };

    const result = checker.setCharacter("t");
    expect(result).toEqual(expected);
    expect(checker.currentRoman).toBe("");
  });

  test("aを入力すると間違いになること", () => {
    const checker = initializeChecker({ word: "か" });
    const result = checker.setCharacter("a");

    const expected: CheckResult = { correct: false };
    expect(result).toEqual(expected);
  });
});

describe("checker 「あ」の場合", () => {
  test("aを入力すると正解になること", () => {
    const checker = initializeChecker({ word: "あ" });
    const result = checker.setCharacter("a");

    const expected: CheckResult = { correct: true };
    expect(result).toEqual(expected);
  });

  test("kを入力すると正解になること", () => {
    const checker = initializeChecker({ word: "あ" });
    const result = checker.setCharacter("k");

    const expected: CheckResult = { correct: false };
    expect(result).toEqual(expected);
  });
});

describe("checker 「てんき」の場合", () => {
  test("tenkiを入力すると正解になること", () => {
    const checker = initializeChecker({ word: "てんき" });

    checker.setCharacter("t");
    expect(checker.currentRoman).toBe("t");
    checker.setCharacter("e");
    expect(checker.currentRoman).toBe("te");
    checker.setCharacter("n");
    expect(checker.currentRoman).toBe("ten");
    checker.setCharacter("k");
    expect(checker.currentRoman).toBe("tenk");

    const result = checker.setCharacter("i");
    expect(checker.currentRoman).toBe("tenki");
    expect(result.correct).toBe(true);
  });

  test("tennkiを入力すると正解になること", () => {
    const checker = initializeChecker({ word: "てんき" });

    checker.setCharacter("t");
    expect(checker.currentRoman).toBe("t");
    checker.setCharacter("e");
    expect(checker.currentRoman).toBe("te");
    checker.setCharacter("n");
    expect(checker.currentRoman).toBe("ten");
    checker.setCharacter("n");
    expect(checker.currentRoman).toBe("tenn");
    checker.setCharacter("k");
    expect(checker.currentRoman).toBe("tennk");

    const result = checker.setCharacter("i");
    expect(checker.currentRoman).toBe("tennki");
    expect(result.correct).toBe(true);
  });
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
