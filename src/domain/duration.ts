export type Duration = number;

export const Duration = {
  fromDates(from: Date, to: Date): Duration {
    return (to.getTime() - from.getTime()) / 1000;
  },
  add(d1: Duration | undefined, d2: Duration): Duration {
    return (d1 ?? 0) + d2;
  },
  format(duration: Duration) {
    const hours = Math.floor(duration / 60 / 60);
    const minutes = Math.floor((duration - (hours * 60 * 60)) / 60);
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}h${paddedMinutes}m`;
  },
};
