import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PagingResult } from '../types'
import { LoadingScreen } from '../components/LoadingScreen'
import { tradeByTimeApi, TradeByTimeApiOutput } from '../services/solscanApi'
import { MediaCard } from '../components/MediaCard'
import { MediaType } from '../components/MediaType'
import { InfiniteGrid } from '../components/InfiniteGrid'
import Image from 'next/image'
import { MultiRangeSlider } from './multiRangeSlider/MultiRangeSilder'
import { COLLECTION_THUMB_SIZE } from '../contants'

export function RecentTradeGrid() {
  const { isLoading, isError, data } = useQuery<
    PagingResult<TradeByTimeApiOutput>
  >('SolscanTokenByTradeTime', tradeByTimeApi, {
    refetchInterval: 1000 * 20,
    keepPreviousData: true,
  })
  const [sliderValues, setSliderValues] = useState<ReadonlyArray<number>>([
    0, 0,
  ])
  const sliderData = useMemo(
    () => data?.data.map((d) => d.sol ?? 0) ?? [],
    [data]
  )
  const xDomain = useMemo(
    () =>
      sliderData.reduce(
        (r, d) => [Math.min(r[0], d), Math.max(r[1], d)],
        [Infinity, -Infinity]
      ),
    [sliderData]
  )
  useEffect(() => setSliderValues(xDomain), [xDomain])
  const itemData = useMemo(
    () =>
      data?.data.filter(
        (d) => d.sol >= sliderValues[0] && d.sol <= sliderValues[1]
      ) ?? [],
    [data, sliderValues]
  )
  const gridCallback = useCallback(
    ({ data, style }) =>
      !data?.src ? null : (
        <a
          href={`https://solscan.io/token/` + data.id}
          target='_blank'
          rel='noreferrer'
          style={style}
          title={data.alt}
        >
          <MediaCard
            key={data.id}
            src={data.src}
            alt={data.alt}
            width={COLLECTION_THUMB_SIZE}
            height={COLLECTION_THUMB_SIZE}
          />
          <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
            <MediaType src={data.src} /> {data.alt}
          </div>
          <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
            <Image alt={data.alt} src='/img/sol.svg' width={12} height={12} />{' '}
            {data.solFormatted}
          </div>
        </a>
      ),
    []
  )
  return (
    <div className='min-h-screen'>
      <MultiRangeSlider
        xDomain={xDomain}
        values={sliderValues}
        onValuesChange={useCallback(
          (values) => setSliderValues(values),
          [setSliderValues]
        )}
        sliderData={sliderData}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <InfiniteGrid
          width={100}
          height={100 + 45}
          itemData={itemData}
          gridCallback={gridCallback}
        />
      )}
    </div>
  )
}
