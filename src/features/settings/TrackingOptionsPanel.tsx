import { SetSettings } from "../../app/tracker-actions";
import { Card } from "../../components/ui/card";

type TrackingOptionsPanelProps = {
  countMissingAsMissed: boolean;
  mascotEnabled: boolean;
  setSettings: SetSettings;
};

export function TrackingOptionsPanel({
  countMissingAsMissed,
  mascotEnabled,
  setSettings,
}: TrackingOptionsPanelProps) {
  return (
    <Card className="settings-panel tracking-options-panel">
      <label className="checkbox-line">
        <input
          type="checkbox"
          checked={countMissingAsMissed}
          onChange={(event) =>
            setSettings({
              compterNonSaisisCommeManques: event.target.checked,
            })
          }
        />{" "}
        Compter les non saisis passés comme manqués
      </label>
      <label className="checkbox-line">
        <input
          type="checkbox"
          checked={mascotEnabled}
          onChange={(event) =>
            setSettings({
              mascotEnabled: event.target.checked,
            })
          }
        />{" "}
        Afficher le compagnon animé du Dashboard
      </label>
    </Card>
  );
}
