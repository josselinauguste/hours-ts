export type Command = { kind: "log"; ts: number } | { kind: "report" };

export function getCommand(args: string[]): Command {
  if (args[0] === "report") {
    return { kind: "report" };
  }
  return { kind: "log", ts: Date.now() };
}
