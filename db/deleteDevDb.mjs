import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbPath = path.join(__dirname, "dev.db");

try {
  fs.unlinkSync(dbPath);
  console.log("dev.db file deleted successfully");

  fs.openSync(dbPath, "w");
  console.log("dev.db file created successfully");
} catch (err) {
  console.error(`Error: ${err}`);
}
