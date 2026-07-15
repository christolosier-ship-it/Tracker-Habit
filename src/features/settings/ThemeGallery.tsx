import React from "react";
import { RotateCcw } from "lucide-react";
import { SetSettings } from "../../app/tracker-actions";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ThemePreview } from "../../components/theme-identity/ThemePreview";
import { defaultThemeId, themes } from "../../themes/theme-registry";

type ThemeGalleryProps = {
  activeThemeId: string;
  setSettings: SetSettings;
};

export function ThemeGallery({
  activeThemeId,
  setSettings,
}: ThemeGalleryProps) {
  return (
    <Card className="appearance-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow compact">Apparence</p>
          <h2>Choisir un style</h2>
          <p>Change l’ambiance de ton tracker selon ton humeur.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setSettings({ themeId: defaultThemeId })}
          type="button"
        >
          <RotateCcw /> Réinitialiser le thème
        </Button>
      </div>
      <div className="theme-gallery">
        {themes.map((theme) => {
          const active = activeThemeId === theme.id;
          return (
            <button
              className={`theme-card ${active ? "active" : ""}`}
              onClick={() => setSettings({ themeId: theme.id })}
              type="button"
              key={theme.id}
              style={
                {
                  "--preview-bg": theme.tokens.background,
                  "--preview-surface": theme.tokens.surface,
                  "--preview-text": theme.tokens.text,
                  "--preview-primary": theme.tokens.primary,
                  "--preview-secondary": theme.tokens.secondary,
                  "--preview-accent": theme.tokens.accent,
                  "--preview-border": theme.tokens.border,
                  background: `linear-gradient(135deg, ${theme.tokens.background}, ${theme.tokens.surface})`,
                } as React.CSSProperties
              }
            >
              <ThemePreview theme={theme} active={active} />
              <div className="theme-card-copy">
                <strong>{theme.name}</strong>
                <span>{theme.description}</span>
                <small>{theme.personality}</small>
              </div>
              <span className="theme-action">
                {active ? "Actif" : "Appliquer"}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
