import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toHalfWidthDigits(raw: string): string {
  return raw.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

export function extractPriceDigits(raw: string): string {
  const digits = toHalfWidthDigits(raw).replace(/[^\d]/g, "");
  return digits ? Number(digits).toLocaleString() : raw;
}

export function formatPrice(raw: string): string {
  if (!raw) return raw;
  const digits = toHalfWidthDigits(raw).replace(/[^\d]/g, "");
  if (!digits) return raw;
  return `NT$ ${Number(digits).toLocaleString()}`;
}
