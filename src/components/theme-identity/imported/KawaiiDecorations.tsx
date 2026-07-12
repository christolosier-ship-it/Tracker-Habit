import type { CSSProperties } from "react";

type DecorationProps = {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

export function KawaiiBunnyMascot({
  size = 96,
  className,
  style,
}: DecorationProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
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

export function KawaiiCloudDecoration({
  size = 60,
  color = "#fff",
  className,
  style,
}: DecorationProps) {
  return (
    <svg
      viewBox="0 0 60 40"
      width={size}
      height={(size * 40) / 60}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="15" cy="25" rx="12" ry="10" fill={color} stroke="#ffb8d4" strokeWidth="2" />
      <ellipse cx="30" cy="20" rx="15" ry="12" fill={color} stroke="#ffb8d4" strokeWidth="2" />
      <ellipse cx="45" cy="25" rx="12" ry="10" fill={color} stroke="#ffb8d4" strokeWidth="2" />
    </svg>
  );
}

export function KawaiiRainbowSticker({
  size = 80,
  className,
  style,
}: DecorationProps) {
  const colors = ["#ff86b8", "#ffd166", "#7dd3fc", "#a78bfa"];
  return (
    <svg
      viewBox="0 0 80 50"
      width={size}
      height={(size * 50) / 80}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {colors.map((color, index) => (
        <path
          key={color}
          d={`M ${8 + index * 4} 45 A ${32 - index * 4} ${32 - index * 4} 0 0 1 ${72 - index * 4} 45`}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <ellipse cx="10" cy="46" rx="8" ry="4" fill="#fff" stroke="#ffb8d4" strokeWidth="2" />
      <ellipse cx="70" cy="46" rx="8" ry="4" fill="#fff" stroke="#ffb8d4" strokeWidth="2" />
    </svg>
  );
}
