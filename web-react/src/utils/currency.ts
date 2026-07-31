export function formatCurrency(amount: number, symbol = 'XOF'): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('fr-FR')} ${symbol}`;
}

export function calculateDiscountedPrice(price: number, discount = 0, discountType?: string): number {
  if (!discount) return price;
  const discounted = discountType === 'percent' ? price - (price * discount) / 100 : price - discount;
  return Math.max(discounted, 0);
}
