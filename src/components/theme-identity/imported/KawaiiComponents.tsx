import {
  KawaiiBunnyMascot,
  KawaiiCloudDecoration,
  KawaiiRainbowSticker,
} from "./KawaiiDecorations";
import "./imported-components.css";

export type KawaiiSignatureProps = {
  score: number;
  streak: number;
};

export function KawaiiPartyHero({ score, streak }: KawaiiSignatureProps) {
  return (
    <section
      className="imported-kawaii-party"
      aria-label="Univers Kawaii Maximalist"
    >
      <KawaiiCloudDecoration
        className="imported-kawaii-cloud imported-kawaii-cloud-left"
        size={70}
      />
      <KawaiiCloudDecoration
        className="imported-kawaii-cloud imported-kawaii-cloud-right"
        size={52}
      />
      <KawaiiRainbowSticker className="imported-kawaii-rainbow" size={74} />
      <div className="imported-kawaii-party-main">
        <KawaiiBunnyMascot size={82} />
        <div className="imported-kawaii-party-copy">
          <span className="imported-kawaii-party-label">HABIT PARTY ✨</span>
          <strong>Salut champion !</strong>
          <small>Chaque petite victoire mérite une étoile.</small>
        </div>
        <div className="imported-kawaii-party-score">
          <strong>{score}%</strong>
          <span>{streak} jours de série</span>
        </div>
      </div>
    </section>
  );
}
