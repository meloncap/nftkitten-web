/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { PagingResult } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import {
  fetchMeCollection,
  fetchMeCollectionResult,
} from '../services/fetchMeCollection'
import { fetchOption } from '../services/fetchOption'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../constants'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'
import { RangeSlider } from './RangeSilder'
import { LoadingCards } from './LoadingCards'
import { MediaType } from './MediaType'

export const MeCollectionGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<fetchMeCollectionResult>>(
      'MeCollection',
      fetchMeCollection,
      fetchOption<PagingResult<fetchMeCollectionResult>>()
    )
  const [silderValues, setSilderValues] = useState<ReadonlyArray<number>>([
    0, 100,
  ])
  const sliderData = useMemo(
    () =>
      data?.pages
        ?.map((d) => d.data)
        .flat()
        .map((d) => d.sol ?? 0) ?? [],
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
    return (
      data?.pages
        ?.map((d) => d.data)
        .flat()
        .filter((d) => d.sol >= min && d.sol <= max) ?? []
    )
  }, [data, xDomain, silderValues])
  const loadMoreItems = useCallback(
    // eslint-disable-next-line no-unused-vars
    (startIndex: number, stopIndex: number) => {
      if (hasNextPage) {
        return fetchNextPage().then(() => {})
      }
    },
    [hasNextPage, fetchNextPage]
  )
  const gridCallback = useCallback(
    ({ data, style }) =>
      !data?.src && !hasNextPage ? null : !data?.src ? (
        <LoadingCards
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE}
          style={style}
        />
      ) : (
        <a
          href={`https://magiceden.io/marketplace/` + data.id}
          target='_blank'
          rel='noreferrer'
          style={style}
          title={data.alt}
        >
          <MediaCard
            src={data.src}
            alt={data.alt}
            width={COLLECTION_THUMB_SIZE}
            height={COLLECTION_THUMB_SIZE}
          ></MediaCard>
          <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
            <MediaType src={data.tokenimage} /> {data.alt}
          </div>
          {!!data.sol && (
            <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
              <Image alt={data.alt} src='/img/sol.svg' width={12} height={12} />{' '}
              {data.solFormatted}
            </div>
          )}
        </a>
      ),
    [hasNextPage]
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
        <AutoSizeGrid
          pageSize={ME_PAGE_LIMIT}
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE + 45}
          itemData={itemData}
          loadMoreItems={hasNextPage ? loadMoreItems : undefined}
        >
          {gridCallback}
        </AutoSizeGrid>
      )}
    </div>
  )
}
