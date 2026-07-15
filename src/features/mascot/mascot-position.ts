export type MascotPoint = { x: number; y: number };

export function parseCssTranslate(transform: string): MascotPoint | null {
  if (!transform || transform === "none") return null;
  const values = transform
    .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
    .split(",")
    .map(Number);
  if (transform.startsWith("matrix3d(") && values.length === 16) {
    return { x: values[12], y: values[13] };
  }
  if (transform.startsWith("matrix(") && values.length === 6) {
    return { x: values[4], y: values[5] };
  }
  return null;
}
