import { describe, expect, test } from "vitest";
import { CheckResult, initializeChecker } from "./checker";
import { createExpectedInput } from "./romantable";

describe("createExpectedInput", () => {
  test("『こんにちは』の入力候補を生成する", () => {
    const expected = createExpectedInput("こんにちは");
    expect(expected).toBe("konnnitiha");
  });

  test("『たった』の入力候補を生成する", () => {
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

describe("checker.currentKana", () => {
  test("aを入力すると、「あ」に変換されること", () => {
    const checker = initializeChecker({ word: "あ" });
    checker.setCharacter("a");

    expect(checker.currentKana).toBe("あ");
  });

  test("kaを入力すると、「か」に変換されること", () => {
    const checker = initializeChecker({ word: "か" });

    checker.setCharacter("k");
    expect(checker.currentKana).toBe("");

    checker.setCharacter("a");
    expect(checker.currentKana).toBe("か");
  });

  test("tenkiを入力すると、「てんき」に変換されること", () => {
    const checker = initializeChecker({ word: "てんき" });

    checker.setCharacter("t");
    checker.setCharacter("e");
    checker.setCharacter("n");
    checker.setCharacter("k");
    checker.setCharacter("i");
    expect(checker.currentKana).toBe("てんき");
  });

  test("「あ」に間違った入力をしても、更新されないこと", () => {
    const checker = initializeChecker({ word: "あ" });

    checker.setCharacter("b");
    expect(checker.currentKana).toBe("");

    checker.setCharacter("k");
    expect(checker.currentKana).toBe("");

    checker.setCharacter("i");
    expect(checker.currentKana).toBe("");
  });
});

describe("「っ」の入力", () => {
  test("「った」はttaで入力できること", () => {
    const checker = initializeChecker({ word: "った" });

    const result = checker.setCharacter("t");
    expect(result.correct).toBe(true);
    const result2 = checker.setCharacter("t");
    expect(result2.correct).toBe(true);
    const result3 = checker.setCharacter("a");
    expect(result3.correct).toBe(true);

    expect(checker.currentKana).toBe("った");
    expect(checker.currentRoman).toBe("tta");
  });

  test("「った」はqqで入力できないこと", () => {
    const checker = initializeChecker({ word: "った" });
    const result = checker.setCharacter("q");

    expect(result.correct).toBe(false);
  });
});

describe("checker.expected", () => {
  test("「あ」の入力で、aを入力したら減ること", () => {
    const checker = initializeChecker({ word: "あ" });
    expect(checker.expected).toBe("a");

    checker.setCharacter("a");
    expect(checker.expected).toBe("");
  });

  test("「さかな」の入力で、sakanaを入力したら減ること", () => {
    const checker = initializeChecker({ word: "さかな" });

    expect(checker.expected).toBe("sakana");

    checker.setCharacter("s");
    expect(checker.expected).toBe("akana");
    checker.setCharacter("a");
    expect(checker.expected).toBe("kana");
    checker.setCharacter("k");
    expect(checker.expected).toBe("ana");
    checker.setCharacter("a");
    expect(checker.expected).toBe("na");
    checker.setCharacter("n");
    expect(checker.expected).toBe("a");
    checker.setCharacter("a");
    expect(checker.expected).toBe("");
  });

  test("「し」をshと入力したら、expectedが更新されること", () => {
    const checker = initializeChecker({ word: "し" });
    expect(checker.expected).toBe("si");

    checker.setCharacter("s");
    expect(checker.expected).toBe("i");
    checker.setCharacter("h");
    expect(checker.expected).toBe("i");
    checker.setCharacter("i");
    expect(checker.expected).toBe("");
  });

  test("「しゃ」をsiと入力したら、expectedが更新されること", () => {
    const checker = initializeChecker({ word: "しゃ" });
    expect(checker.expected).toBe("sya");

    checker.setCharacter("s");
    expect(checker.expected).toBe("ya");
    checker.setCharacter("i");
    expect(checker.expected).toBe("xya");
    checker.setCharacter("x");
    expect(checker.expected).toBe("ya");
    checker.setCharacter("y");
    expect(checker.expected).toBe("a");
    checker.setCharacter("a");
    expect(checker.expected).toBe("");
  });

  test("「てんき」の入力で、tenkiと入力してexpectedが正しく更新されること", () => {
    const checker = initializeChecker({ word: "てんき" });
    expect(checker.expected).toBe("tennki");

    checker.setCharacter("t");
    expect(checker.expected).toBe("ennki");
    checker.setCharacter("e");
    expect(checker.expected).toBe("nnki");
    checker.setCharacter("n");
    expect(checker.expected).toBe("nki");
    checker.setCharacter("k");
    expect(checker.expected).toBe("i");
    checker.setCharacter("i");
    expect(checker.expected).toBe("");
  });
});

describe("「いっぬ」の入力", () => {
  test("iltunuで入力できること", () => {
    const checker = initializeChecker({ word: "いっぬ" });
    expect(checker.setCharacter("i").correct).toBe(true);
    expect(checker.setCharacter("l").correct).toBe(true);
    expect(checker.setCharacter("t").correct).toBe(true);
    expect(checker.setCharacter("u").correct).toBe(true);
    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.setCharacter("u").correct).toBe(true);
  });

  test("ixtunuで入力できること", () => {
    const checker = initializeChecker({ word: "いっぬ" });
    expect(checker.setCharacter("i").correct).toBe(true);
    expect(checker.setCharacter("x").correct).toBe(true);
    expect(checker.setCharacter("t").correct).toBe(true);
    expect(checker.setCharacter("u").correct).toBe(true);
    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.setCharacter("u").correct).toBe(true);
  });

  test("innuで入力できないこと", () => {
    const checker = initializeChecker({ word: "いっぬ" });
    expect(checker.setCharacter("i").correct).toBe(true);
    expect(checker.setCharacter("n").correct).toBe(false);
  });
});

describe("「んん」の入力", () => {
  test("nnnnで入力できること", () => {
    const checker = initializeChecker({ word: "んん" });
    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.currentKana).toBe("");
    expect(checker.currentRoman).toBe("n");

    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.currentKana).toBe("ん");
    expect(checker.currentRoman).toBe("nn");

    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.currentKana).toBe("ん");
    expect(checker.currentRoman).toBe("nnn");

    expect(checker.setCharacter("n").correct).toBe(true);
    expect(checker.currentKana).toBe("んん");
    expect(checker.currentRoman).toBe("nnnn");
  });
});
