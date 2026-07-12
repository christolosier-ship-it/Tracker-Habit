import { AppTheme } from "../../themes/theme-types";
import {
  AuroraFocusWidget,
  BrutalistManifesto,
  ComicHeroMission,
  CosmicOrbitScore,
  EditorialQuoteWidget,
  GrowthBloomWidget,
  LiquidFlowScore,
  MemphisShapeScore,
  MoodBubbleWidget,
  SystemStatusWidget,
} from "./signatures/widgets";
import { ArcadePlayerHud } from "./imported/ArcadeComponents";
import { KawaiiRewardCollection } from "./imported/KawaiiComponents";

export type ThemeSignatureWidgetProps = {
  theme: AppTheme;
  score: number;
  streak: number;
  activeHabits: number;
  year?: number;
  doneLogs?: number;
  disciplinedDays?: number;
};

export function ThemeSignatureWidget(props: ThemeSignatureWidgetProps) {
  switch (props.theme.identity.signatureWidget) {
    case "system-status":
      return <SystemStatusWidget {...props} />;
    case "mood-bubble":
      return <MoodBubbleWidget {...props} />;
    case "shape-score":
      return <MemphisShapeScore {...props} />;
    case "aurora-focus":
      return <AuroraFocusWidget {...props} />;
    case "growth-bloom":
      return <GrowthBloomWidget {...props} />;
    case "player-hud":
      return <ArcadePlayerHud {...props} />;
    case "orbit-score":
      return <CosmicOrbitScore {...props} />;
    case "reward-collection":
      return <KawaiiRewardCollection {...props} />;
    case "control-manifesto":
      return <BrutalistManifesto {...props} />;
    case "editorial-quote":
      return <EditorialQuoteWidget {...props} />;
    case "hero-mission":
      return <ComicHeroMission {...props} />;
    case "flow-score":
      return <LiquidFlowScore {...props} />;
    default:
      return null;
  }
}
