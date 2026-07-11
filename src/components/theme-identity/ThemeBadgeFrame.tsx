import React from "react";
import { AppTheme } from "../../themes/theme-types";

type Props = {
  theme: AppTheme;
  children: React.ReactNode;
};

export function ThemeBadgeFrame({ children }: Props) {
  return <>{children}</>;
}
