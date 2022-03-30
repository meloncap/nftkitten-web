import { useSpring, animated } from 'react-spring'
import { HistogramChart } from './HistogramChart'
import { useDrag } from '@use-gesture/react'
import { useElementSize } from 'usehooks-ts'
import { formatSol } from '../../utils/numberFormatter'
import { useCallback, useMemo, MouseEvent, useEffect, useState } from 'react'
import Image from 'next/image'

export function MultiRangeSlider({
  xDomain,
  values,
  onValuesChange,
  sliderData,
}: {
  xDomain: ReadonlyArray<number>
  values: ReadonlyArray<number>
  onValuesChange: (values: ReadonlyArray<number>) => void
  sliderData: Array<number>
}) {
  const [xDomainAdj, setXDomainAdj] = useState(xDomain)
  useEffect(() => setXDomainAdj(xDomain), [xDomain, setXDomainAdj])
  const [containerRef, { width }] = useElementSize()
  const [{ x: xMin }, apiMin] = useSpring({ x: 0 }, [])
  const innerWidth = width - 40
  const bindMin = useDrag(
    ({ offset: [x] }) => {
      let xMaxVal = xMax.get()
      if (xMaxVal < x - innerWidth) {
        xMaxVal = x - innerWidth
        apiMax.start({ x: xMaxVal, immediate: true })
      }
      apiMin.start({ x, immediate: true })
      onValuesChange([(x / innerWidth) * 100, (1 + xMaxVal / innerWidth) * 100])
    },
    {
      axis: 'x',
      bounds: { left: 0, right: innerWidth, top: 0, bottom: 0 },
      from: () => [xMin.get(), 0],
    }
  )
  const [{ x: xMax }, apiMax] = useSpring({ x: 0 }, [])
  const bindMax = useDrag(
    ({ offset: [x] }) => {
      let xMinVal = xMin.get()
      if (xMinVal > innerWidth + x) {
        xMinVal = innerWidth + x
        apiMin.start({ x: xMinVal, immediate: true })
      }
      apiMax.start({ x, immediate: true })
      onValuesChange([(xMinVal / innerWidth) * 100, (1 + x / innerWidth) * 100])
    },
    {
      axis: 'x',
      bounds: { left: -innerWidth, right: 0, top: 0, bottom: 0 },
      from: () => [xMax.get(), 0],
    }
  )
  const data = useMemo(() => {
    const stats: { [key: string]: number } = {}
    let maxCount = -Infinity
    for (const val of sliderData) {
      const percent = Math.ceil(
        ((val - xDomainAdj[0]) / (xDomainAdj[1] - xDomainAdj[0])) * 100
      ).toString()
      stats[percent] = (stats[percent] ?? 0) + 1
      if (stats[percent] > maxCount) maxCount = stats[percent]
    }
    const data: Array<number> = []
    for (let x = 0; x <= 100; x++) {
      if (x.toString() in stats) {
        data.push(30 + Math.ceil((stats[x] / maxCount) * 70))
      } else {
        data.push(0)
      }
    }
    return data
  }, [xDomainAdj, sliderData])
  const clickHandler = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const rect = ev.currentTarget.getBoundingClientRect()
      const evX = ev.clientX - rect.left
      const minDiff = Math.abs(evX - xMin.get())
      const maxDiff = Math.abs(rect.width - evX + xMax.get())
      if (minDiff < maxDiff) {
        xMin.set(evX)
        onValuesChange([
          (evX / rect.width) * 100,
          (1 + xMax.get() / rect.width) * 100,
        ])
      } else {
        xMax.set(evX - rect.width)
        onValuesChange([
          (xMin.get() / rect.width) * 100,
          (1 + (evX - rect.width) / rect.width) * 100,
        ])
      }
    },
    [onValuesChange, xMax, xMin]
  )
  const minSolVal =
    xDomainAdj[0] + (xDomainAdj[1] - xDomainAdj[0]) * (xMin.get() / innerWidth)
  const minSol = useMemo(() => formatSol(minSolVal), [minSolVal])
  const maxSolVal =
    xDomainAdj[0] +
    (xDomainAdj[1] - xDomainAdj[0]) * (1 + xMax.get() / innerWidth)
  const maxSol = useMemo(() => formatSol(maxSolVal), [maxSolVal])
  return (
    <div className='relative' style={{ margin: 16, height: 100 }}>
      {data.length && xDomainAdj[0] !== Infinity && (
        <>
          <HistogramChart
            xDomain={xDomainAdj}
            data={data}
            highlight={values}
            width={innerWidth}
            height={43}
          />
          <div
            className='relative'
            style={{
              top: 36,
              height: 44,
              transition: 'padding .4s ease-in-out',
              perspective: '510px',
            }}
          >
            <div className='overflow-visible absolute inset-0 w-full'>
              <div
                className='w-full h-full'
                style={{
                  touchAction: 'none',
                }}
              ></div>
              <div
                className='flex absolute inset-0 z-30 flex-col items-center select-none'
                ref={containerRef}
              >
                <animated.button
                  className='absolute left-0 z-30 p-0 text-2xl text-center bg-left-top border-0 opacity-70 cursor-pointer'
                  type='button'
                  role='slider'
                  tabIndex={0}
                  style={{
                    top: '-5px',
                    width: '40px',
                    height: '40px',
                    lineHeight: '40px',
                    cursor: '-webkit-grab',
                    touchAction: 'none',
                    transform: xMin.to((x) => `translate(${x}px, 0)`),
                  }}
                  {...bindMin()}
                >
                  <svg
                    className='inline-block overflow-visible text-3xl pointer-events-auto'
                    aria-hidden='true'
                    focusable='false'
                    style={{
                      width: '1em',
                      touchAction: 'none',
                      height: '1em',
                      verticalAlign: '-0.125em',
                    }}
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                  >
                    <path
                      fill='currentColor'
                      d='M153.6,409.6V0h204.8v409.6L256,512L153.6,409.6z'
                    ></path>
                  </svg>
                </animated.button>
                <animated.button
                  className='absolute right-0 z-30 p-0 text-2xl text-center bg-left-top border-0 opacity-70 cursor-pointer'
                  type='button'
                  role='slider'
                  tabIndex={0}
                  style={{
                    top: '-5px',
                    width: '40px',
                    height: '40px',
                    lineHeight: '40px',
                    cursor: '-webkit-grab',
                    touchAction: 'none',
                    transform: xMax.to((x) => `translate(${x}px, 0)`),
                  }}
                  {...bindMax()}
                >
                  <svg
                    className='inline-block overflow-visible text-3xl pointer-events-auto'
                    aria-hidden='true'
                    focusable='false'
                    style={{
                      width: '1em',
                      touchAction: 'none',
                      height: '1em',
                      verticalAlign: '-0.125em',
                    }}
                    role='img'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                  >
                    <path
                      fill='currentColor'
                      d='M153.6,409.6V0h204.8v409.6L256,512L153.6,409.6z'
                    ></path>
                  </svg>
                </animated.button>
                <div
                  className='absolute inset-0 z-10 cursor-pointer'
                  style={{ left: 20, right: 20 }}
                  onClick={clickHandler}
                ></div>
                <animated.div
                  className='absolute inset-y-0 bg-blue-500 pointer-events-none'
                  style={{
                    top: 7,
                    height: 12,
                    zIndex: -1,
                    touchAction: 'none',
                    cursor: '-webkit-grab',
                    left: xMin.to((x) => x + 26),
                    right: xMax.to((x) => -x + 26),
                  }}
                ></animated.div>
              </div>
            </div>
            <div
              className='bottom-0 z-10 select-none'
              style={{
                height: '20px',
                marginTop: '-6px',
                transform: 'rotateX(45deg)',
                transformOrigin: 'bottom center',
                borderBottom: '2px solid #6c757d',
                backgroundColor: '#adb5bd',
              }}
            ></div>
            <div className='flex justify-between'>
              <small className='pt-1 text-gray-400'>
                <Image alt={minSol} src='/img/sol.svg' width={12} height={12} />{' '}
                {minSol}
              </small>
              <small className='pt-1 text-gray-400'>
                <Image alt={maxSol} src='/img/sol.svg' width={12} height={12} />{' '}
                {maxSol}
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
