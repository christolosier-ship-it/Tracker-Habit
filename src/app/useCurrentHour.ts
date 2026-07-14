import { useEffect, useState } from "react";

function readHour() {
  return new Date().getHours();
}

export function useCurrentHour() {
  const [hour, setHour] = useState(readHour);

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 50);
      timer = window.setTimeout(() => {
        setHour(readHour());
        schedule();
      }, nextHour.getTime() - now.getTime());
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return hour;
}
