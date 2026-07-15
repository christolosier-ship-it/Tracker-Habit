import type { ChangeEvent } from "react";
import { useState } from "react";
import { Download, RotateCcw, Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  AppData,
  demoData,
  migrateData,
  resetData,
  validateImport,
} from "../../persistence";
import type { ReplaceData } from "../../app/tracker-actions";

type DataTransferPanelProps = {
  data: AppData;
  replaceData: ReplaceData;
};

export function DataTransferPanel({ data, replaceData }: DataTransferPanelProps) {
  const [message, setMessage] = useState("");

  const exportJson = () => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    link.href = url;
    link.download = "discipline-dashboard.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    file
      .text()
      .then((text) => {
        const imported: unknown = JSON.parse(text);
        if (validateImport(imported)) {
          replaceData(migrateData(imported));
          setMessage("Import réussi.");
        } else {
          setMessage("JSON invalide : structure non reconnue.");
        }
      })
      .catch(() => setMessage("Import impossible."));
  };

  const hardReset = () => {
    const confirmation = window.prompt(
      "Tape RESET pour confirmer la remise à zéro complète.",
    );
    if (confirmation === "RESET") {
      resetData();
      replaceData(demoData());
      setMessage("Données réinitialisées.");
    }
  };

  return (
    <Card className="settings-panel data-transfer-panel">
      <div className="settings-actions">
        <Button onClick={exportJson} type="button">
          <Download /> Exporter JSON
        </Button>
        <label className="file-button">
          <Upload /> Importer JSON
          <input
            type="file"
            accept="application/json"
            onChange={importJson}
          />
        </label>
        <Button
          variant="secondary"
          onClick={() => replaceData(demoData())}
          type="button"
        >
          <RotateCcw /> Recharger la démo
        </Button>
        <Button variant="danger" onClick={hardReset} type="button">
          <X /> Reset complet
        </Button>
      </div>
      {message && <p className="settings-message">{message}</p>}
    </Card>
  );
}
