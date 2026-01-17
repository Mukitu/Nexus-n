export function fmtCurrencyBDT(amount: number) {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function fmtNumber(amount: number, digits = 0) {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-BD", { maximumFractionDigits: digits }).format(amount);
}
