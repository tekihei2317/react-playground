import { expect, test } from "vitest";
import { convert } from "./romantable";

test("しゅ", () => {
  expect(convert("syu")).toBe("しゅ");
  expect(convert("shu")).toBe("しゅ");
  expect(convert("silyu")).toBe("しゅ");
  expect(convert("sixyu")).toBe("しゅ");
});

test("きゃっしゅ", () => {
  expect(convert("kyassyu")).toBe("きゃっしゅ");
});

test("きゅうきょ", () => {
  expect(convert("kyuukyo")).toBe("きゅうきょ");
});

test("ぎょうむれんらく", () => {
  expect(convert("gyoumurenraku")).toBe("ぎょうむれんらく");
});

test("いんねんのたいけつ", () => {
  const expected = "いんねんのたいけつ";

  expect(convert("innnennnotaiketu")).toBe(expected);
  expect(convert("ixnnexnnotaiketu")).toBe(expected);
});

test("いんふぉめーしょん", () => {
  const expected = "いんふぉめーしょん";

  expect(convert("infome-syonn")).toBe(expected);
  expect(convert("infulome-silyonn")).toBe(expected);
});

test.skip("・あ", () => {
  expect(convert("/a")).toBe("・あ");
});
