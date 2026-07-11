import { AppTheme } from "../../themes/theme-types";import { ThemeDecorations } from "./ThemeDecorations";
export function ThemeIdentityLayer({theme}:{theme:AppTheme}){return <div className="theme-identity-layer" aria-hidden="true"><ThemeDecorations theme={theme}/></div>}
