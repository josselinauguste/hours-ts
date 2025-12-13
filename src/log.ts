export interface LogLine {
  cmd: "start" | "stop";
  ts: number;
}

export function openLog(file: string) {
  return {
    async reduce<T, R>(
      reducer: (previousValue: R, currentValue: T) => R,
      initialValue: R,
    ): Promise<R> {
      const logFile = await Deno.readTextFile(file);
      return logFile.split("\n")
        .map((line) => {
          console.log(line);
          return line;
        })
        .filter((v) => !!v)
        .map((v) => JSON.parse(v))
        .reduce(reducer, initialValue);
    },
    append(line: LogLine) {
      return Deno.writeTextFile(file, JSON.stringify(line) + "\n", {
        append: true,
      });
    },
  };
}

export type Log = ReturnType<typeof openLog>;
