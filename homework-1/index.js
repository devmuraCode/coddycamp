import { log, readLogs } from "./logger.js";

async function main() {
  await log("APP STARTED");

  setTimeout(async () => {
    await log("FIRST TIMEOUT EVENT");
  }, 2000);

  let count = 0;
  const intervalId = setInterval(async () => {
    count++;
    await log("INTERVAL TICK");

    if (count === 3) {
      clearInterval(intervalId);
    }
  }, 1000);

  setTimeout(async () => {
    const text = await readLogs();

    console.log("\n===== LOGS =====\n");
    console.log(text);
    console.log("\n==============\n");
  }, 6000);
}

main();
