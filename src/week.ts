const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getStartOfWeek(date: Date = new Date(), startDay = 0): Date {
  const result = new Date(date);
  const diff = getDayOfWeekFromStartDay(result, startDay) - startDay;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getDayOfWeekFromStartDay(date: Date, startDay: number) {
  const day = date.getDay();
  return (day < startDay ? 7 : 0) + day;
}

export function getDayName(dayOfWeek: number) {
  return DAYS[dayOfWeek];
}
