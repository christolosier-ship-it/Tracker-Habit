type ClassName = string | false | null | undefined;

export function cn(...classNames: ClassName[]) {
  return classNames.filter(Boolean).join(" ");
}
