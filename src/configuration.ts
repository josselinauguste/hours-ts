import * as path from "@std/path";
import {ensureFile} from "@std/fs";

export async function getConfiguration(env: Deno.Env) {
  const home = env.get("HOME");
  if (!home) {
    throw new Error("HOME environment variable not set");
  }
  const logFile = path.join(home, ".local/share/hours/hours.log");
  await ensureFile(logFile);
  return logFile;
}
