import { useEffect, useState } from "react";
import { formatLocalIso } from "../lib/date-utils";

function readCurrentTime() {
  const now = new Date();
  return { date: formatLocalIso(now), hour: now.getHours() };
}

export function useCurrentTime() {
  const [current, setCurrent] = useState(readCurrentTime);

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 50);
      timer = window.setTimeout(() => {
        setCurrent(readCurrentTime());
        schedule();
      }, nextHour.getTime() - now.getTime());
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return current;
}
