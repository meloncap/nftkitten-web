import { useSpring, animated } from 'react-spring'
import { HistogramChart } from './HistogramChart'
import { useDrag } from '@use-gesture/react'
import { formatSol } from '../../utils/numberFormatter'
import { useCallback, MouseEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { xToValue, valueToX } from './utils'
import { useElementSize } from 'usehooks-ts'

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
  const [containerRef, { width }] = useElementSize()
  const [zoomedXDomain, setZoomedXDomain] = useState(xDomain)
  useEffect(() => setZoomedXDomain(xDomain), [xDomain])
  const innerWidth = width - 40
  const [{ xMin, xMax }, api] = useSpring(
    {
      xMin: zoomedXDomain[0],
      xMax: zoomedXDomain[1],
      onChange({ value: { xMin, xMax } }) {
        onValuesChange([xMin, xMax])
      },
    },
    [zoomedXDomain, onValuesChange]
  )

  useEffect(() => {
    api.start({
      xMin: xDomain[0],
      xMax: xDomain[1],
      immediate: true,
    })
  }, [api, xDomain])

  const bindMin = useDrag(
    ({ offset: [x] }) => {
      const xMinVal = xToValue(x, innerWidth, zoomedXDomain)
      api.start({
        xMin: xMinVal,
        xMax: Math.max(xMinVal, xMax.get()),
        immediate: true,
      })
    },
    {
      axis: 'x',
      bounds: { left: 0, right: innerWidth, top: 0, bottom: 0 },
      from: () => [valueToX(xMin.get(), innerWidth, zoomedXDomain), 0],
    }
  )
  const bindMax = useDrag(
    ({ offset: [x] }) => {
      const xMaxVal = xToValue(innerWidth + x, innerWidth, zoomedXDomain)
      api.start({
        xMax: xMaxVal,
        xMin: Math.min(xMaxVal, xMin.get()),
        immediate: true,
      })
    },
    {
      axis: 'x',
      bounds: { left: -innerWidth, right: 0, top: 0, bottom: 0 },
      from: () => [
        valueToX(xMax.get(), innerWidth, zoomedXDomain) - innerWidth,
        0,
      ],
    }
  )
  const handleSliderClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const rect = ev.currentTarget.getBoundingClientRect()
      const evX = xToValue(ev.clientX - rect.left, rect.width, zoomedXDomain)
      const minDiff = Math.hypot(xMin.get() - evX)
      const maxDiff = Math.hypot(evX - xMax.get())
      if (minDiff < maxDiff) {
        api.start({ xMin: evX, immediate: true })
      } else {
        api.start({ xMax: evX, immediate: true })
      }
    },
    [api, xMin, xMax, zoomedXDomain]
  )
  const handleHistogramClick = useCallback(
    (newXDomain) => {
      if (zoomedXDomain[0] != xDomain[0] || zoomedXDomain[1] != xDomain[1]) {
        setZoomedXDomain(xDomain)
      } else {
        api.start({
          xMin: Math.max(xMin.get(), newXDomain[0]),
          xMax: Math.min(xMax.get(), newXDomain[1]),
          immediate: true,
        })
        setZoomedXDomain(newXDomain)
      }
    },
    [zoomedXDomain, xDomain, api, xMin, xMax]
  )
  if (
    !sliderData.length ||
    !isFinite(zoomedXDomain[0]) ||
    !isFinite(zoomedXDomain[1])
  ) {
    return null
  }
  return (
    <div
      className='relative'
      style={{ marginLeft: 16, marginRight: 16, height: 100, marginTop: 10 }}
    >
      {sliderData.length && (
        <>
          <HistogramChart
            xDomain0={zoomedXDomain[0]}
            xDomain1={zoomedXDomain[1]}
            data={sliderData}
            highlight0={values[0]}
            highlight1={values[1]}
            width={innerWidth}
            height={43}
            onClick={handleHistogramClick}
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
                    transform: xMin.to(
                      (x) =>
                        `translate(${
                          isFinite(x)
                            ? valueToX(x, innerWidth, zoomedXDomain)
                            : 0
                        }px`
                    ),
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
                    transform: xMax.to(
                      (x) =>
                        `translate(${
                          isFinite(x)
                            ? valueToX(x, innerWidth, zoomedXDomain) -
                              innerWidth
                            : 0
                        }px`
                    ),
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
                  onClick={handleSliderClick}
                ></div>
                <animated.div
                  className='absolute inset-y-0 bg-blue-500 pointer-events-none'
                  style={{
                    top: 7,
                    height: 12,
                    zIndex: -1,
                    touchAction: 'none',
                    cursor: '-webkit-grab',
                    left: xMin.to(
                      (x) =>
                        (isFinite(x)
                          ? valueToX(x, innerWidth, zoomedXDomain)
                          : 0) + 26
                    ),
                    right: xMax.to(
                      (x) =>
                        (isFinite(x)
                          ? innerWidth - valueToX(x, innerWidth, zoomedXDomain)
                          : 0) + 26
                    ),
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
                <Image alt='Solana' src='/img/sol.svg' width={12} height={12} />{' '}
                <animated.span>{xMin.to((x) => formatSol(x))}</animated.span>
              </small>
              <small className='pt-1 text-gray-400'>
                <Image alt='Solana' src='/img/sol.svg' width={12} height={12} />{' '}
                <animated.span>{xMax.to((x) => formatSol(x))}</animated.span>
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
