import {apply, loadState} from "./state.ts";
import {openLog} from "./log.ts";
import {getConfiguration} from "./configuration.ts";
import {getCommand} from "./command.ts";
import {report} from "./report.ts";

const configuration = await getConfiguration(Deno.env);

const log = openLog(configuration.logFile);
const state = await loadState(log);

const command = getCommand(Deno.args);
const event = apply(state, command);
if (event) {
  await log.append(event);
}

switch (command.kind) {
  case "report":
    report(state, configuration.startOfWeek);
    break;
}
