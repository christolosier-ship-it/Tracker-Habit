import { AppTheme } from "../../themes/theme-types";
const counts:Record<string,number>={circuit:10,confetti:17,memphis:9,aurora:5,leaves:6,pixels:19,stars:27,stickers:9,"color-clash":3,"fine-lines":6,halftone:7,"liquid-blobs":7};
export function ThemeDecorations({theme}:{theme:AppTheme}){const v=theme.identity.decoration.variant;return <div className="theme-decorations" data-decoration={v} data-density={theme.identity.decoration.density} aria-hidden="true">{Array.from({length:counts[v]??8},(_,i)=><i key={i} className={`decor decor-${i%6}`}/>)}</div>}
