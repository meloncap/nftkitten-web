export function xToPercent(x: number, innerWidth: number) {
  return (x / innerWidth) * 100
}

export function xToValue(
  x: number,
  innerWidth: number,
  xDomain: ReadonlyArray<number>
) {
  return xDomain[0] + (xDomain[1] - xDomain[0]) * (x / innerWidth)
}

export function percentToX(percent: number, innerWidth: number) {
  return (innerWidth * percent) / 100
}

export function percentToValue(
  percent: number,
  xDomain: ReadonlyArray<number>
) {
  const range = xDomain[1] - xDomain[0]
  return xDomain[0] + (range * percent) / 100
}

export function valueToX(
  value: number,
  innerWidth: number,
  xDomain: ReadonlyArray<number>
) {
  return (innerWidth * valueToPercent(value, xDomain)) / 100
}

export function valueToPercent(value: number, xDomain: ReadonlyArray<number>) {
  const range = xDomain[1] - xDomain[0]
  return Math.ceil(((value - xDomain[0]) / range) * 100)
}
