import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { PagingResult } from '../types'
import { LoadingScreen } from '../components/LoadingScreen'
import { launchpadApi, LaunchpadApiOutput } from '../services/magicEdenApi'
import { queryOption } from '../services/queryOption'
import { InfiniteGrid } from '../components/InfiniteGrid'
import { MediaCard } from '../components/MediaCard'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../contants'
import { LoadingCards } from '../components/LoadingCards'
import { MediaType } from '../components/MediaType'

export const MeLaunchpadGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<LaunchpadApiOutput>>(
      'MeLaunchpad',
      launchpadApi,
      queryOption<PagingResult<LaunchpadApiOutput>>()
    )
  const itemData = useMemo(() => data?.pages?.map((d) => d.data).flat(), [data])
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
          href={`https://magiceden.io/launchpad/` + data.id}
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
          <div className='flex overflow-hidden justify-between text-xs text-ellipsis whitespace-nowrap'>
            <b>{data.date?.substring(0, 10)}</b>
            <b>{data.featured && `⭐ `}</b>
          </div>
        </a>
      ),
    [hasNextPage]
  )
  return (
    <div className='min-h-screen'>
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
