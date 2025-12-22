import {evolve, log, State} from "../domain/state.ts";
import {Event} from "../domain/event.ts";

export type Command = { kind: "log"; ts: number } | { kind: "report" };

export function parseCommand(args: string[]): Command {
  if (args[0] === "report") {
    return { kind: "report" };
  }
  return { kind: "log", ts: Date.now() };
}

export function handleCommand(state: State, command: Command) {
  const event = applyCommand(command, state);
  const newState = event ? evolve(state, event) : state;
  return [newState, event] as const;
}

function applyCommand(command: Command, state: State) {
  switch (command.kind) {
    case "log":
      return log(state, command.ts);
    case "report":
      return null;
  }
}
