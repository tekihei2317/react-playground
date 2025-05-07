import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "tuki-2-263-us.txt");
console.log(filePath);
const content = await fs.readFile(filePath, { encoding: "utf-8" });

console.log(
  JSON.stringify(
    content.split("\n").map((row) => {
      const entry = row.split("\t");
      return {
        input: entry[0],
        output: entry[1],
        ...(entry[2] ? { nextInput: entry[2] } : {}),
      };
    })
  )
);
