const monthIndexes = new Map([
  ['january', 0],
  ['february', 1],
  ['march', 2],
  ['april', 3],
  ['may', 4],
  ['june', 5],
  ['july', 6],
  ['august', 7],
  ['september', 8],
  ['october', 9],
  ['november', 10],
  ['december', 11],
]);

function getDateTime(dateValue: string, timeValue?: string): number {
  const nativeDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  const displayDateMatch = /^[A-Za-z]+\s+(\d{1,2})(?:st|nd|rd|th)\s+([A-Za-z]+)\s+(\d{4})$/.exec(dateValue);

  let year = 0;
  let month = 0;
  let day = 0;

  if (nativeDateMatch) {
    year = Number(nativeDateMatch[1]);
    month = Number(nativeDateMatch[2]) - 1;
    day = Number(nativeDateMatch[3]);
  } else if (displayDateMatch) {
    day = Number(displayDateMatch[1]);
    month = monthIndexes.get(displayDateMatch[2].toLowerCase()) ?? -1;
    year = Number(displayDateMatch[3]);
  }

  if (!year || month < 0 || !day) {
    return Number.MAX_SAFE_INTEGER;
  }

  return new Date(year, month, day).getTime() + getTimeOffset(timeValue);
}

function getTimeOffset(timeValue?: string): number {
  if (!timeValue) {
    return 0;
  }

  const timeMatch = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(timeValue.trim());

  if (!timeMatch) {
    return 0;
  }

  const period = timeMatch[3].toLowerCase();
  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] ?? 0);

  if (period === 'am' && hours === 12) {
    hours = 0;
  }

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  }

  return ((hours * 60) + minutes) * 60 * 1000;
}

export function sortEventsByDate<T extends { date: string; time?: string }>(events: T[]): T[] {
  return [...events].sort((firstEvent, secondEvent) => (
    getDateTime(firstEvent.date, firstEvent.time) - getDateTime(secondEvent.date, secondEvent.time)
  ));
}
