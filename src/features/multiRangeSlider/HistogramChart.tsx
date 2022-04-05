import { BarChart, Bar, BarProps, Cell } from 'recharts'
import { useMemo } from 'react'
import { valueToPercent, percentToValue } from './utils'

export function HistogramChart({
  xDomain0,
  xDomain1,
  width,
  height,
  data,
  highlight0,
  highlight1,
}: {
  xDomain0: number
  xDomain1: number
  width: number
  height: number
  data: Array<number>
  highlight0: number
  highlight1: number
}) {
  const step = width < 800 ? 4 : width < 1200 ? 2 : 1
  const dataInXDomain = useMemo(() => {
    const stats: {
      [key: string]: { count: number; min: number; max: number }
    } = {}
    let maxCount = -Infinity
    for (const val of data) {
      const percent = valueToPercent(val, [xDomain0, xDomain1]).toString()
      if (percent in stats) {
        stats[percent].count++
        if (val < stats[percent].min) {
          stats[percent].min = val
        }
        if (val > stats[percent].max) {
          stats[percent].max = val
        }
      } else {
        stats[percent] = {
          count: 1,
          min: val,
          max: val,
        }
      }
      if ((stats[percent]?.count ?? 0) > maxCount) {
        maxCount = stats[percent]?.count ?? 0
      }
      if (val < xDomain0 || val > xDomain1) {
        delete stats[percent]
      }
    }
    const retVal: BarProps['data'] = []
    for (let x = 0; x <= 100; x += step) {
      if (x.toString() in stats) {
        const count = stats[x].count
        retVal.push({
          value: 50 + Math.ceil((count / maxCount) * 50),
          min: stats[x].min,
          max: stats[x].max,
        })
      } else {
        retVal.push({ value: 0 })
      }
    }
    return retVal
  }, [data, step, xDomain0, xDomain1])

  const valueLookup = useMemo(
    () =>
      dataInXDomain.reduce(
        (r: { [id: string]: number }, _, i) => ({
          ...r,
          [i.toString()]: percentToValue(i * step, [xDomain0, xDomain1]),
        }),
        {}
      ),
    [dataInXDomain, xDomain0, xDomain1]
  )

  if (!data) {
    return null
  }
  return (
    <div
      className='overflow-hidden absolute'
      style={{ left: 20, right: 20, width, height }}
    >
      <div
        className='overflow-visible relative w-full'
        style={{ width, height }}
      >
        <BarChart
          width={width}
          height={height}
          data={dataInXDomain}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barCategoryGap={0}
          barGap={0}
        >
          <Bar dataKey='value' isAnimationActive={false}>
            {dataInXDomain.map((_, index) => (
              <Cell
                cursor='pointer'
                fill={
                  highlight0 <= valueLookup[index.toString()] &&
                  valueLookup[index.toString()] <= highlight1
                    ? '#1A56DB'
                    : '#6C757D'
                }
                stroke={'#CCCCCC'}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  )
}
