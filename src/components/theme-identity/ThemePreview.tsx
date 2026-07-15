import { AppTheme } from "../../themes/theme-types";

type ThemePreviewProps = {
  theme: AppTheme;
  active: boolean;
};

export function ThemePreview({ theme, active }: ThemePreviewProps) {
  const colors = [
    theme.tokens.primary,
    theme.tokens.secondary,
    theme.tokens.accent,
    theme.tokens.accent2,
    theme.tokens.success,
  ];
  const mascotSrc = `${import.meta.env.BASE_URL}mascots/previews/${theme.id}.webp`;

  return (
    <div
      className="theme-preview identity-preview"
      data-preview-style={theme.effects.backgroundStyle}
    >
      <div className="preview-bg">
        <span className="theme-preview-fallback" aria-hidden="true">
          {theme.previewEmoji}
        </span>
        <img
          className="theme-preview-mascot"
          src={mascotSrc}
          alt=""
          width={512}
          height={512}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
        <i className="preview-frame" aria-hidden="true" />
        <i
          className="preview-cell"
          data-cell-variant={theme.identity.cells.variant}
          aria-hidden="true"
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
