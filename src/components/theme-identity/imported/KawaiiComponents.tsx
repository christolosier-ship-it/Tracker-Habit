import type { ReactNode } from "react";
import {
  KawaiiBearMascot,
  KawaiiBunnyMascot,
  KawaiiCatMascot,
  KawaiiCloudDecoration,
  KawaiiHeart,
  KawaiiRainbowSticker,
  KawaiiStar,
} from "./KawaiiDecorations";
import "./imported-components.css";

export type KawaiiSignatureProps = {
  score: number;
  streak: number;
  disciplinedDays?: number;
};

export function KawaiiPartyHero({ score, streak }: KawaiiSignatureProps) {
  return (
    <section className="imported-kawaii-party" aria-label="Univers Kawaii Maximalist">
      <KawaiiCloudDecoration className="imported-kawaii-cloud imported-kawaii-cloud-left" size={70} />
      <KawaiiCloudDecoration className="imported-kawaii-cloud imported-kawaii-cloud-right" size={52} />
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

export function KawaiiHappinessScore({ score }: { score: number }) {
  const activeHearts = Math.max(0, Math.min(5, Math.round(score / 20)));
  return (
    <div className="imported-kawaii-widget imported-kawaii-happiness">
      <KawaiiHeart className="imported-kawaii-corner-heart" size={22} />
      <span className="imported-kawaii-widget-title">Score bonheur</span>
      <div className="imported-kawaii-happiness-row">
        <KawaiiBearMascot size={62} />
        <div>
          <strong>{score}%</strong>
          <div className="imported-kawaii-hearts" aria-label={`${activeHearts} cœurs sur 5`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <KawaiiHeart key={index} size={15} color={index < activeHearts ? "#ff86b8" : "#ffe3ef"} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KawaiiRewardCollection({ score, streak, disciplinedDays }: KawaiiSignatureProps) {
  const stars = disciplinedDays ?? score;
  return (
    <div className="imported-kawaii-collection" aria-label="Collection de récompenses Kawaii">
      <KawaiiCatMascot size={48} />
      <div className="imported-kawaii-counters">
        <span><KawaiiStar size={17} /> {stars}</span>
        <span><KawaiiHeart size={17} /> {streak}</span>
      </div>
      <div className="imported-kawaii-reward-copy">
        <strong>Récompense</strong>
        <span>Bonheur {score}%</span>
      </div>
      <div className="imported-kawaii-reward-track" aria-label={`Progression ${score}%`}>
        <span style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
    </div>
  );
}

export function KawaiiRewardCard({ label = "Badge licorne", progress = 75 }: { label?: string; progress?: number }) {
  return (
    <div className="imported-kawaii-widget imported-kawaii-reward-card">
      <div className="imported-kawaii-reward-icon"><KawaiiStar size={28} color="#fff" /></div>
      <div className="imported-kawaii-reward-body">
        <strong>{label}</strong>
        <small>Encore quelques étoiles pour évoluer.</small>
        <div className="imported-kawaii-reward-track"><span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
      </div>
    </div>
  );
}

export function KawaiiStickerCalendar({ values }: { values: Array<"done" | "partial" | "missed" | "rest" | "empty"> }) {
  const symbols = { done: "♥", partial: "★", missed: "×", rest: "☁", empty: "·" } as const;
  return (
    <div className="imported-kawaii-widget">
      <span className="imported-kawaii-widget-title">Calendrier stickers</span>
      <div className="imported-kawaii-sticker-grid">
        {values.map((status, index) => <span key={`${status}-${index}`} data-status={status}>{symbols[status]}</span>)}
      </div>
    </div>
  );
}

export function KawaiiCuteButton({ children }: { children: ReactNode }) {
  return <button type="button" className="imported-kawaii-button">{children}</button>;
}
