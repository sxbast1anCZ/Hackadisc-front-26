type ClassValue = string | number | null | boolean | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${trimTrailingZero(value / 1_000_000)}m`;
  }
  if (value >= 1_000) {
    return `${trimTrailingZero(value / 1_000)}k`;
  }
  return `${value}`;
}

function trimTrailingZero(value: number): string {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
}
