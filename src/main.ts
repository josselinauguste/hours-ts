import {apply, loadState} from "./state.ts";
import {openLog} from "./log.ts";
import {getConfiguration} from "./configuration.ts";
import {getCommand} from "./command.ts";
import {report} from "./report.ts";
import {Duration} from "./duration.ts";

const configuration = await getConfiguration(Deno.env);

const log = openLog(configuration.logFile);
const state = await loadState(log);

const command = getCommand(Deno.args);
const [newState, event] = apply(state, command);
if (event) {
  await log.append(event);
}

switch (command.kind) {
  case "log":
    if (event?.kind === "start") console.log("Starting a new journey!");
    else if (event) {
      const session = newState.sessions[newState.sessions.length - 1];
      const duration = Duration.fromDates(session.start, session.end);
      console.log(`Yoloed it for ${Duration.format(duration)}!`);
    }
    break;
  case "report":
    report(state, configuration.startOfWeek);
    break;
}
