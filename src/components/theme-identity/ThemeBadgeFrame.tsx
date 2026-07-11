import React from "react";import { AppTheme } from "../../themes/theme-types";
export function ThemeBadgeFrame({theme,children}:{theme:AppTheme;children:React.ReactNode}){return <span className="theme-badge-frame" data-badge={theme.identity.badges.variant}>{children}</span>}
