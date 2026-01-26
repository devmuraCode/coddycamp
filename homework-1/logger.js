import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_PATH = path.join(__dirname, "logs.txt");

export async function log(message) {
  const time = new Date().toISOString();
  const line = `${time} - ${message}\n`;

  try {
    await fs.appendFile(LOG_PATH, line, "utf-8");
  } catch (err) {
    console.error("Log yozishda xatolik:", err?.message || err);
  }
}

export async function readLogs() {
  try {
    const data = await fs.readFile(LOG_PATH, "utf-8");
    return data;
  } catch (err) {
    if (err?.code === "ENOENT") {
      console.error("logs.txt topilmadi (hali yaratilmagan).");
      return "";
    }
    console.error("Loglarni o‘qishda xatolik:", err?.message || err);
    return "";
  }
}
