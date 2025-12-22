import { Event } from "../domain/event.ts";

export function openLog(file: string) {
  return {
    async reduce<R>(
      reducer: (previousValue: R, currentValue: Event) => R,
      initialValue: R,
    ): Promise<R> {
      const logFile = await Deno.readTextFile(file);
      return logFile.split("\n")
        .filter((v) => !!v)
        .map((v) => JSON.parse(v))
        .reduce(reducer, initialValue);
    },
    append(line: Event) {
      return Deno.writeTextFile(file, JSON.stringify(line) + "\n", {
        append: true,
      });
    },
  };
}
