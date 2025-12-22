import {Session} from "../domain/state.ts";
import {Duration} from "../domain/duration.ts";

export function printStatus(session: Session) {
  const duration = Duration.fromDates(session.start, session.end);
  console.log(`Yoloed hard for ${Duration.format(duration)}!`);
}
