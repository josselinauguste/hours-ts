import * as path from "@std/path";
import {ensureFile} from "@std/fs";
import {Configuration} from "../domain/configuration.ts";

export async function getConfiguration(
  env: Deno.Env,
): Promise<Configuration> {
  const home = env.get("HOME");
  if (!home) {
    throw new Error("HOME environment variable not set");
  }
  const logFile = path.join(home, ".local/share/hours/hours.log");
  await ensureFile(logFile);
  return { logFile, startOfWeek: 1 };
}
