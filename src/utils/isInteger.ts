export function isInteger(value: number): boolean {
  return typeof value === 'number' && isFinite(value) && ~~value === value
}
