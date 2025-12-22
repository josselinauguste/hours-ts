import {Event, LogReducer} from "./log.ts";
import {Command} from "./command.ts";

interface ActiveSession {
  started: Date;
}

export interface Session {
  start: Date;
  end: Date;
}

export interface State {
  sessions: Session[];
  currentSession: ActiveSession | null;
}

export function loadState(log: LogReducer<State>): Promise<State> {
  return log
    .reduce((state: State, event: Event) => evolve(state, event) ?? state, {
      sessions: [],
      currentSession: null,
    });
}

function evolve(state: State, event: Event): State {
  switch (event.kind) {
    case "start":
      if (state.currentSession === null) {
        return { ...state, currentSession: { started: new Date(event.ts) } };
      }
      break;
    case "stop":
      if (state.currentSession !== null) {
        const sessions = [...state.sessions, {
          start: state.currentSession.started,
          end: new Date(event.ts),
        }];
        return { sessions, currentSession: null };
      }
  }
  throw new Error("Unexpected event");
}

export function apply(state: State, command: Command) {
  const event = applyCommandToState(command, state);
  const newState = event ? evolve(state, event) : state;
  return [newState, event] as const;
}

function applyCommandToState(
  command: { kind: "log"; ts: number } | { kind: "report" },
  state: State,
): Event | null {
  switch (command.kind) {
    case "log":
      if (state.currentSession === null) {
        return { kind: "start", ts: command.ts };
      } else {
        return { kind: "stop", ts: command.ts };
      }
    case "report":
      return null;
  }
}
