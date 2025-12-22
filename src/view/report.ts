import {Session, State} from "../domain/state.ts";
import {Duration} from "../domain/duration.ts";
import {getDayName, getDayOfWeekFromStartDay, getStartOfWeek,} from "../domain/week.ts";

export function report(state: State, startDay: number) {
  const startOfWeek = getStartOfWeek(new Date(), startDay);
  const week = state.sessions.filter((s) => s.start >= startOfWeek).reduce(
    reduceWeekSessions(startDay),
    {},
  );
  Object.keys(week).sort().forEach((dayOfWeek) => {
    console.log(
      `${getDayName(Number.parseInt(dayOfWeek))}\t${
        Duration.format(week[dayOfWeek])
      }`,
    );
  });
  const weekTime = Object.values(week).reduce((sum, value) => sum + value, 0);
  console.log(`\t${Duration.format(weekTime)}`);
}

const reduceWeekSessions =
  (startDay: number) => (days: Record<string, number>, session: Session) => {
    const dayOfWeek = getDayOfWeekFromStartDay(session.start, startDay)
      .toString();
    const cumulatedDuration = Duration.add(
      days[dayOfWeek],
      Duration.fromDates(session.start, session.end),
    );
    return {
      ...days,
      [dayOfWeek]: cumulatedDuration,
    };
  };
