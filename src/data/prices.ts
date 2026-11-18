/**
 * Prices live here so one edit updates the page. Always shown as "from" so
 * Nawaz can raise them without rewriting the copy.
 */
const inr = new Intl.NumberFormat('en-IN')

export const PRICES = {
  shop: { amount: 2000, reels: 4 },
  edit: { simple: 100, withShootFrom: 300, withShootTo: 500 },
}

/** Keeps the rupee symbol and Indian digit grouping in one place. */
const rupees = (amount: number) => `₹${inr.format(amount)}`

export const PRICE_TEXT = {
  shopLine: `From ${rupees(PRICES.shop.amount)} for ${PRICES.shop.reels} reels`,
  editLine: `Simple edits from ${rupees(PRICES.edit.simple)}. With shooting, ${rupees(PRICES.edit.withShootFrom)} to ${rupees(PRICES.edit.withShootTo)}.`,
}
