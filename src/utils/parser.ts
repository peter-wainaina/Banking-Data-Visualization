
// This file is a toolkit for parsing and normalizing all the weird data formats you get in banking CSVs.

// Converts a currency string ("$1,234.56") to a number
export function parseAmount(value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const s = String(value).trim();
  if (s === "" || s.toUpperCase() === "N/A") return 0;
  // Remove anything that's not a digit, dot, sign, or exponent
  const cleaned = s.replace(/[^0-9.+-eE]/g, "");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}


// Parses a date string in many formats (ISO, MM/DD/YYYY, etc.)
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const s = String(value).trim();
  if (!s) return null;

  // Try ISO format first
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;

  // Try US format (M/D/YYYY)
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const mm = Number(m[1]) - 1;
    const dd = Number(m[2]);
    const yyyy = Number(m[3]);
    const d = new Date(yyyy, mm, dd);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback: let JS try to parse it
  const fallback = Date.parse(s);
  return isNaN(fallback) ? null : new Date(fallback);
}


// Extracts a numeric customer ID from a string
export function parseCustomerId(value: string | null | undefined): number | null {
  if (!value) return null;
  const n = Number(String(value).replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}


// Parses age, making sure it's a reasonable number
export function parseCustomerAge(value: string | null | undefined): number | null {
  if (!value) return null;
  const n = Number(String(value).replace(/[^\d\-]/g, ""));
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 120) return null;
  return n;
}


// Standardizes gender values to "Male", "Female", or "Other"
export function normalizeGender(value: string | null | undefined): "Male" | "Female" | "Other" {
  if (!value) return "Other";
  const v = value.trim().toLowerCase();
  if (v === "m" || v === "male" || v === "man") return "Male";
  if (v === "f" || v === "female" || v === "woman") return "Female";
  return "Other";
}


// Standardizes transaction types to a fixed set
export function normalizeTransactionType(value: string | null | undefined): "deposit" | "withdrawal" | "transfer" | "payment" | "other" {
  if (!value) return "other";
  const v = value.trim().toLowerCase();
  if (v.includes("deposit")) return "deposit";
  if (v.includes("with") || v.includes("withdraw")) return "withdrawal";
  if (v.includes("trans")) return "transfer";
  if (v.includes("pay")) return "payment";
  return "other";
}


// Formats a date as YYYY-MM for grouping by month
export function formatDateForGrouping(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}


// Calculates the number of months between two dates
export function getMonthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}
