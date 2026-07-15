const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalIso(value: string) {
  if (!ISO_DATE_PATTERN.test(value)) return new Date(Number.NaN);
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const parsed = parseLocalIso(value);
  return !Number.isNaN(parsed.getTime()) && formatLocalIso(parsed) === value;
}

export function compareIsoDates(left: string, right: string) {
  return left === right ? 0 : left < right ? -1 : 1;
}

export function shiftIsoDate(value: string, days: number) {
  const date = parseLocalIso(value);
  date.setDate(date.getDate() + days);
  return formatLocalIso(date);
}

export function monthPrefix(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function* iterateIsoDates(start: string, end: string) {
  if (compareIsoDates(start, end) > 0) return;
  const cursor = parseLocalIso(start);
  const last = parseLocalIso(end);
  while (cursor <= last) {
    yield formatLocalIso(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
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

export function getIsoWeekBounds(value: string) {
  const date = parseLocalIso(value);
  const dayFromMonday = (date.getDay() + 6) % 7;
  const start = new Date(date);
  const end = new Date(date);
  start.setDate(start.getDate() - dayFromMonday);
  end.setDate(end.getDate() + 6 - dayFromMonday);
  return {
    start: formatLocalIso(start),
    end: formatLocalIso(end),
  };
}
