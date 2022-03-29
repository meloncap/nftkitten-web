/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PagingResult } from '../global'
import { LoadingScreen } from './LoadingScreen'
import {
  fetchSolByTradeTime,
  fetchSolByTradeTimeResult,
} from '../services/fetchSolByTradeTime'
import { MediaCard } from './MediaCard'
import { MediaType } from './MediaType'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'
import { RangeSlider } from './RangeSilder'
import { COLLECTION_THUMB_SIZE } from '../constants'

export function RecentTradeGrid() {
  const { isLoading, isError, data } = useQuery<
    PagingResult<fetchSolByTradeTimeResult>
  >('SolscanTokenByTradeTime', fetchSolByTradeTime, {
    refetchInterval: 1000 * 20,
    keepPreviousData: true,
  })
  const [silderValues, setSilderValues] = useState<ReadonlyArray<number>>([
    0, 100,
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
  const itemData = useMemo(() => {
    const min = xDomain[0] + ((xDomain[1] - xDomain[0]) * silderValues[0]) / 100
    const max = xDomain[0] + ((xDomain[1] - xDomain[0]) * silderValues[1]) / 100
    return data?.data.filter((d) => d.sol >= min && d.sol <= max) ?? []
  }, [data, xDomain, silderValues])
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
    <div className='grow min-h-screen'>
      <RangeSlider
        xDomain={xDomain}
        values={silderValues}
        onValuesChange={useCallback(
          (values) => setSilderValues(values),
          [setSilderValues]
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
        <AutoSizeGrid width={100} height={100 + 45} itemData={itemData}>
          {gridCallback}
        </AutoSizeGrid>
      )}
    </div>
  )
}
