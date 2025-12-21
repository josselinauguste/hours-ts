import {getConfiguration} from "../src/configuration.ts";

const configuration = await getConfiguration(Deno.env);

const sourceFile = Deno.args[0];
const targetFile = configuration.logFile;

const source = await Deno.readTextFile(sourceFile);

let currentDate = new Date(Date.parse(Deno.args[1]));
let previousTime: number | undefined;
let previousKind: string | undefined;
source.split("\n").forEach(async (line) => {
  if (line.trim().length === 0) {
    currentDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 3);
    return;
  }
  const [hour, minutes] = line.split(":").map(Number);
  const logTime = currentDate.setHours(hour, minutes);
  if (logTime < (previousTime ?? 0)) {
    currentDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24);
    previousTime = currentDate.setHours(hour, minutes);
  } else {
    previousTime = logTime;
  }
  previousKind = previousKind === "start" ? "stop" : "start";
  const log = { kind: previousKind, ts: previousTime };
  await Deno.writeTextFile(targetFile, JSON.stringify(log) + "\n", {
    append: true,
  });
});
