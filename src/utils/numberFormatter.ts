export function formatSol(price: number | null | undefined) {
  return price
    ? new Intl.NumberFormat('en-US', {
        maximumSignificantDigits: 2,
      }).format(price / 100000000)
    : ''
}
