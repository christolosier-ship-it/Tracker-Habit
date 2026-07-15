import type { ReactNode } from "react";

type ThemeKpiFrameProps = {
  children: ReactNode;
};

export function ThemeKpiFrame({ children }: ThemeKpiFrameProps) {
  return <div className="theme-kpi-frame">{children}</div>;
}
