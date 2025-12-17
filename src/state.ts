import {Event, LogReducer} from "./log.ts";
import {Command} from "./command.ts";

export interface ActiveSession {
  started: Date;
}

export interface State {
  currentSession: ActiveSession | null;
}

export function loadState(log: LogReducer<State>): Promise<State> {
  return log
    .reduce((state: State, event: Event) => evolve(state, event) ?? state, {
      sessions: [],
      currentSession: null,
    });
}

function evolve(state: State, event: Event): State | undefined {
  if (event.kind === "start" && state.currentSession === null) {
    return { ...state, currentSession: { started: new Date(event.ts) } };
  }
  if (event.kind === "stop") {
    return { ...state, currentSession: null };
  }
}

export function apply(state: State, command: Command): Event | null {
  switch (command.kind) {
    case "log":
      if (state.currentSession === null) {
        return { kind: "start", ts: command.ts };
      } else {
        return { kind: "stop", ts: command.ts };
      }
  }
}
