import { PeriodControls } from "../features/period/PeriodControls";
import { DataTransferPanel } from "../features/settings/DataTransferPanel";
import { ThemeGallery } from "../features/settings/ThemeGallery";
import { TrackingOptionsPanel } from "../features/settings/TrackingOptionsPanel";
import { SettingsPageProps } from "./page-types";

export function SettingsPage({
  data,
  setSettings,
  replaceData,
}: SettingsPageProps) {
  return (
    <>
      <PeriodControls
        year={data.settings.anneeActive}
        month={data.settings.moisActif}
        onYearChange={(year) => setSettings({ anneeActive: year })}
        onMonthChange={(month) => setSettings({ moisActif: month })}
      />
      <ThemeGallery
        activeThemeId={data.settings.themeId}
        setSettings={setSettings}
      />
      <TrackingOptionsPanel
        countMissingAsMissed={data.settings.compterNonSaisisCommeManques}
        mascotEnabled={data.settings.mascotEnabled}
        setSettings={setSettings}
      />
      <DataTransferPanel data={data} replaceData={replaceData} />
    </>
  );
}
