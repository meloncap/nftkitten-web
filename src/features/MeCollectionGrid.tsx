import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { PagingResult } from '../types'
import { LoadingScreen } from '../components/LoadingScreen'
import { MediaCard } from '../components/MediaCard'
import { collectionApi, CollectionApiOutput } from '../services/magicEdenApi'
import { queryOption } from '../services/queryOption'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../contants'
import { InfiniteGrid } from '../components/InfiniteGrid'
import Image from 'next/image'
import { MultiRangeSlider } from './multiRangeSlider/MultiRangeSilder'
import { LoadingCards } from '../components/LoadingCards'
import { MediaType } from '../components/MediaType'

export const MeCollectionGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<CollectionApiOutput>>(
      'MeCollection',
      collectionApi,
      queryOption<PagingResult<CollectionApiOutput>>()
    )
  const [sliderValues, setSliderValues] = useState<ReadonlyArray<number>>([
    0, 0,
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
  useEffect(() => setSliderValues(xDomain), [xDomain])
  const itemData = useMemo(() => {
    return (
      data?.pages
        ?.map((d) => d.data)
        .flat()
        .filter((d) => d.sol >= sliderValues[0] && d.sol <= sliderValues[1]) ??
      []
    )
  }, [data, sliderValues])
  const loadMoreItems = useCallback(
    (_startIndex: number, _stopIndex: number) => {
      if (hasNextPage) {
        return fetchNextPage().then(() => void 0)
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
          pageSize={ME_PAGE_LIMIT}
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE + 45}
          itemData={itemData}
          loadMoreItems={hasNextPage ? loadMoreItems : undefined}
          gridCallback={gridCallback}
        />
      )}
    </div>
  )
}
