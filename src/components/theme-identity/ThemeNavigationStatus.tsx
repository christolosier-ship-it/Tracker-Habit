import { AppTheme } from "../../themes/theme-types";

type ThemeNavigationStatusProps = {
  theme: AppTheme;
};

export function ThemeNavigationStatus({
  theme,
}: ThemeNavigationStatusProps) {
  if (theme.identity.navigation.status === "terminal") {
    return (
      <div className="theme-navigation-status terminal">
        <span />
        SYS ONLINE
        <i />
      </div>
    );
  }

  if (theme.identity.navigation.status === "arcade") {
    return (
      <div className="theme-navigation-status arcade">
        <b>PLAYER 1</b>
        <i />
        <i />
        <i />
        <span>READY</span>
      </div>
    );
  }

  return null;
}
