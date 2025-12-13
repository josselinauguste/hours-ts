import {Log, LogLine} from "./log.ts";

export interface ActiveSession {
  started: Date;
}

export interface State {
  currentSession: ActiveSession | null;
}

export function loadState(log: Log): Promise<State> {
  return log
    .reduce((state: State, line: LogLine) => {
      if (line.cmd === "start" && state.currentSession === null) {
        return { currentSession: { started: new Date(line.ts) } };
      }
      if (line.cmd === "stop") {
        return { currentSession: null };
      }
      return state;
    }, { currentSession: null });
}
