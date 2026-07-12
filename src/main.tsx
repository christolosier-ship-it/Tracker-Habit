import { createRoot } from "react-dom/client";
import "./styles.css";
import "./styles-cleanup.css";
import "./responsive-layout-charts.css";
import "./styles-density-pass.css";
import { App } from "./app/App";

const root = document.getElementById("root");
if (!root) throw new Error("Élément #root introuvable");

createRoot(root).render(<App />);
