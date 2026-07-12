import type { CSSProperties } from "react";

type DecorationProps = {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

export function KawaiiBunnyMascot({ size = 96, className, style }: DecorationProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <ellipse cx="35" cy="18" rx="7" ry="18" fill="#fff" stroke="#ff86b8" strokeWidth="3" />
      <ellipse cx="65" cy="18" rx="7" ry="18" fill="#fff" stroke="#ff86b8" strokeWidth="3" />
      <ellipse cx="35" cy="20" rx="3" ry="12" fill="#ffb8d4" />
      <ellipse cx="65" cy="20" rx="3" ry="12" fill="#ffb8d4" />
      <circle cx="50" cy="55" r="32" fill="#fff" stroke="#ff86b8" strokeWidth="3" />
      <circle cx="34" cy="62" r="5" fill="#ffb8d4" opacity="0.7" />
      <circle cx="66" cy="62" r="5" fill="#ffb8d4" opacity="0.7" />
      <circle cx="40" cy="52" r="3.5" fill="#4a2740" />
      <circle cx="60" cy="52" r="3.5" fill="#4a2740" />
      <circle cx="41" cy="51" r="1" fill="#fff" />
      <circle cx="61" cy="51" r="1" fill="#fff" />
      <path d="M46 66 Q50 70 54 66" stroke="#4a2740" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function KawaiiBearMascot({ size = 96, className, style }: DecorationProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <circle cx="28" cy="30" r="10" fill="#c9a084" stroke="#4a2740" strokeWidth="2" />
      <circle cx="72" cy="30" r="10" fill="#c9a084" stroke="#4a2740" strokeWidth="2" />
      <circle cx="28" cy="30" r="5" fill="#ffb8d4" />
      <circle cx="72" cy="30" r="5" fill="#ffb8d4" />
      <circle cx="50" cy="55" r="30" fill="#e8c9a8" stroke="#4a2740" strokeWidth="2" />
      <ellipse cx="50" cy="66" rx="14" ry="10" fill="#fff5e8" />
      <circle cx="40" cy="52" r="3" fill="#4a2740" />
      <circle cx="60" cy="52" r="3" fill="#4a2740" />
      <ellipse cx="50" cy="62" rx="3" ry="2" fill="#4a2740" />
      <path d="M50 64 L50 68 M46 70 Q50 72 54 70" stroke="#4a2740" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="62" r="4" fill="#ffb8d4" opacity="0.6" />
      <circle cx="68" cy="62" r="4" fill="#ffb8d4" opacity="0.6" />
    </svg>
  );
}

export function KawaiiCatMascot({ size = 96, className, style }: DecorationProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M22 40 L28 15 L40 32 Z" fill="#a78bfa" stroke="#4a2740" strokeWidth="2" />
      <path d="M78 40 L72 15 L60 32 Z" fill="#a78bfa" stroke="#4a2740" strokeWidth="2" />
      <path d="M27 32 L29 22 L34 30 Z" fill="#ffb8d4" />
      <path d="M73 32 L71 22 L66 30 Z" fill="#ffb8d4" />
      <circle cx="50" cy="55" r="28" fill="#c9b8f0" stroke="#4a2740" strokeWidth="2" />
      <path d="M38 52 Q40 48 42 52" stroke="#4a2740" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M58 52 Q60 48 62 52" stroke="#4a2740" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M48 60 L50 62 L52 60 Z" fill="#ff86b8" />
      <line x1="30" y1="62" x2="42" y2="63" stroke="#4a2740" strokeWidth="1" />
      <line x1="70" y1="62" x2="58" y2="63" stroke="#4a2740" strokeWidth="1" />
      <line x1="30" y1="66" x2="42" y2="65" stroke="#4a2740" strokeWidth="1" />
      <line x1="70" y1="66" x2="58" y2="65" stroke="#4a2740" strokeWidth="1" />
      <path d="M45 66 Q50 70 55 66" stroke="#4a2740" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="62" r="4" fill="#ffb8d4" opacity="0.7" />
      <circle cx="66" cy="62" r="4" fill="#ffb8d4" opacity="0.7" />
    </svg>
  );
}

export function KawaiiHeart({ size = 24, color = "#ff86b8", className, style }: DecorationProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false"><path d="M12 21s-8-5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-8 11-8 11z" fill={color} stroke="#fff" strokeWidth="1.5" /></svg>;
}

export function KawaiiStar({ size = 24, color = "#ffd166", className, style }: DecorationProps) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false"><path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" fill={color} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
}

export function KawaiiCloudDecoration({ size = 60, color = "#fff", className, style }: DecorationProps) {
  return <svg viewBox="0 0 60 40" width={size} height={(size * 40) / 60} className={className} style={style} aria-hidden="true" focusable="false"><ellipse cx="15" cy="25" rx="12" ry="10" fill={color} stroke="#ffb8d4" strokeWidth="2" /><ellipse cx="30" cy="20" rx="15" ry="12" fill={color} stroke="#ffb8d4" strokeWidth="2" /><ellipse cx="45" cy="25" rx="12" ry="10" fill={color} stroke="#ffb8d4" strokeWidth="2" /></svg>;
}

export function KawaiiRainbowSticker({ size = 80, className, style }: DecorationProps) {
  const colors = ["#ff86b8", "#ffd166", "#7dd3fc", "#a78bfa"];
  return <svg viewBox="0 0 80 50" width={size} height={(size * 50) / 80} className={className} style={style} aria-hidden="true" focusable="false">{colors.map((color, index) => <path key={color} d={`M ${8 + index * 4} 45 A ${32 - index * 4} ${32 - index * 4} 0 0 1 ${72 - index * 4} 45`} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />)}<ellipse cx="10" cy="46" rx="8" ry="4" fill="#fff" stroke="#ffb8d4" strokeWidth="2" /><ellipse cx="70" cy="46" rx="8" ry="4" fill="#fff" stroke="#ffb8d4" strokeWidth="2" /></svg>;
}
