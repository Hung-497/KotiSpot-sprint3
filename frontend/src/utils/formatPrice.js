const priceFormatter = new Intl.NumberFormat("fi-FI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

// Display-only: formats a price as euros, e.g. 250000 -> "250 000 €".
// Values that are not numbers are returned unchanged.
export function formatPrice(value) {
  const amount = typeof value === "string" ? Number(value) : value;

  if (value === "" || value == null || !Number.isFinite(amount)) {
    return value ?? "";
  }

  return priceFormatter.format(amount);
}
