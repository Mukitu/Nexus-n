export function stripDemoLabel(s: string) {
  return s
    .replace(/\s*\(demo\)\s*/gi, "")
    .replace(/\s*\(ডেমো\)\s*/g, "")
    .replace(/\bdemo\b/gi, "")
    .trim();
}

export function isDemoText(s: string) {
  const v = (s ?? "").toLowerCase();
  return v.includes("(demo)") || v.includes("demo") || (s ?? "").includes("(ডেমো)");
}
