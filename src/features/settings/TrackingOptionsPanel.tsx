import { Card } from "../../components/ui/card";
import { SetSettings } from "../../pages/page-types";

type TrackingOptionsPanelProps = {
  countMissingAsMissed: boolean;
  setSettings: SetSettings;
};

export function TrackingOptionsPanel({
  countMissingAsMissed,
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
    </Card>
  );
}
