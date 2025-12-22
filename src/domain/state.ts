import {Event} from "./event.ts";

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

export type EventReducer<R> = {
  reduce(
    reducer: (state: R, event: Event) => R,
    initialState: R,
  ): Promise<R>;
};

export function loadState(log: EventReducer<State>): Promise<State> {
  return log
    .reduce((state: State, event: Event) => evolve(state, event) ?? state, {
      sessions: [],
      currentSession: null,
    });
}

export function evolve(state: State, event: Event): State {
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

export function log(state: State, ts: number): Event | null {
  if (state.currentSession === null) {
    return { kind: "start", ts: ts };
  } else {
    return { kind: "stop", ts: ts };
  }
}
