import { loadState } from "./domain/state.ts";
import { openLog } from "./infrastructure/log.ts";
import { getConfiguration } from "./infrastructure/configuration.ts";
import { handleCommand, parseCommand } from "./application/command.ts";
import { printReport } from "./view/report.ts";
import { printStatus } from "./view/status.ts";

const configuration = await getConfiguration(Deno.env);

const log = openLog(configuration.logFile);
const state = await loadState(log);

const command = parseCommand(Deno.args);
const [newState, event] = handleCommand(state, command);
if (event) {
  await log.append(event);
}

switch (command.kind) {
  case "log":
    if (event?.kind === "start") console.log("Starting a new journey!");
    else if (event?.kind === "stop") {
      printStatus(newState.sessions[newState.sessions.length - 1]);
    }
    break;
  case "status":
    if (newState.currentSession) {
      printStatus({ start: newState.currentSession.started, end: new Date() });
    } else {
      console.log("Not yoloing right now.");
    }
    break;
  case "report":
    printReport(state, configuration.startOfWeek);
    break;
}
