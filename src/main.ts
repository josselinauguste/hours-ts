import { loadState } from "./state.ts";
import { openLog } from "./log.ts";
import { getConfiguration } from "./configuration.ts";

const logFile = await getConfiguration(Deno.env);

const log = openLog(logFile);

const state = await loadState(log);

if (state.currentSession === null) {
  await log.append({ cmd: "start", ts: Date.now() });
} else {
  await log.append({ cmd: "stop", ts: Date.now() });
}
