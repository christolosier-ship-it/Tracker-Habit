import type { ReactNode } from "react";
import { AppTheme } from "../../themes/theme-types";

type ThemeKpiFrameProps = {
  theme: AppTheme;
  children: ReactNode;
  /** Compatibilité transitoire avec l’ancien appel, sans rendu ni attribut DOM. */
  index?: number;
  label?: string;
  value?: number | string;
};

export function ThemeKpiFrame({ theme, children }: ThemeKpiFrameProps) {
  return (
    <div className="theme-kpi-frame" data-frame={theme.identity.frame}>
      {children}
    </div>
  );
}
