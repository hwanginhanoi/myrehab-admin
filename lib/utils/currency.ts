/**
 * Formats a number as Vietnamese Dong (VND) currency
 * @param amount - The amount to format (should be a whole number)
 * @returns Formatted currency string (e.g., "50.000 ₫")
 */
export function formatVND(amount?: number | null): string {
  if (amount == null || amount === 0) return '0 ₫';
  return amount.toLocaleString('vi-VN') + ' ₫';
}
