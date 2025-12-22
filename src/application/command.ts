import {evolve, log, State} from "../domain/state.ts";
import {Event} from "../domain/event.ts";

export type Command =
  | { kind: "log"; ts: number }
  | { kind: "report" }
  | { kind: "status" };

export function parseCommand(args: string[]): Command {
  switch (args[0]) {
    case "report":
      return { kind: "report" };
    case "status":
      return { kind: "status" };
    case undefined:
      return { kind: "log", ts: Date.now() };
  }
  throw new Error("Unknown command");
}

export function handleCommand(
  state: State,
  command: Command,
): [State, Event | null] {
  const event = applyCommand(command, state);
  const newState = event ? evolve(state, event) : state;
  return [newState, event] as const;
}

function applyCommand(command: Command, state: State): Event | null {
  switch (command.kind) {
    case "log":
      return log(state, command.ts);
  }
  return null;
}
