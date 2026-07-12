import { AppTheme } from "../../themes/theme-types";

type ThemePreviewProps = {
  theme: AppTheme;
  active: boolean;
};

function signatureFor(theme: AppTheme) {
  if (theme.identity.signatureWidget === "player-hud") return "XP▮▮▮";
  if (theme.identity.signatureWidget === "reward-collection") return "兔 ★ ♥";
  return theme.previewEmoji;
}

export function ThemePreview({ theme, active }: ThemePreviewProps) {
  const colors = [
    theme.tokens.primary,
    theme.tokens.secondary,
    theme.tokens.accent,
    theme.tokens.accent2,
    theme.tokens.success,
  ];

  return (
    <div
      className="theme-preview identity-preview"
      data-preview-style={theme.effects.backgroundStyle}
    >
      <div className="preview-bg">
        <span className="theme-preview-signature">{signatureFor(theme)}</span>
        <i className="preview-frame" />
        <i
          className="preview-cell"
          data-cell-variant={theme.identity.cells.variant}
        />
      </div>
      <div className="theme-swatches">
        {colors.map((color) => (
          <i style={{ background: color }} key={color} />
        ))}
      </div>
      {active && <span className="preview-active">Actif</span>}
    </div>
  );
}
