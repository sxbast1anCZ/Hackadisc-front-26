type ClassValue = string | number | null | boolean | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatCLP(value: number): string {
  return `$ ${new Intl.NumberFormat("es-CL").format(Math.round(value))}`;
}
