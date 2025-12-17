export type Command = { kind: "log"; ts: number };

export function getCommand(args: string[]): Command {
  return { kind: "log", ts: Date.now() };
}
