import type { ReactNode } from "react";
import { AppTheme } from "../../themes/theme-types";

type ThemeKpiFrameProps = {
  theme: AppTheme;
  children: ReactNode;
};

export function ThemeKpiFrame({ theme, children }: ThemeKpiFrameProps) {
  return (
    <div className="theme-kpi-frame" data-frame={theme.identity.frame}>
      {children}
    </div>
  );
}
