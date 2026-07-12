const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalIso(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) return new Date(Number.NaN);
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function compareIsoDates(left: string, right: string) {
  return left.localeCompare(right);
}

export function isIsoDatePast(value: string) {
  return compareIsoDates(value, formatLocalIso(new Date())) < 0;
}

export function monthPrefix(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function iterateIsoDates(start: string, end: string) {
  if (compareIsoDates(start, end) > 0) return [];
  const dates: string[] = [];
  const cursor = parseLocalIso(start);
  const last = parseLocalIso(end);
  while (cursor <= last) {
    dates.push(formatLocalIso(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function getIsoWeekKey(value: string) {
  const date = parseLocalIso(value);
  const target = new Date(date);
  const day = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - day + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4, 12);
  const firstDay = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
  const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
  return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
}
