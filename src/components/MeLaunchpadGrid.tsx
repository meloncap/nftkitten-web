import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { PagingResult } from '../global'
import { LoadingScreen } from './LoadingScreen'
import {
  fetchMeLaunchpad,
  fetchMeLaunchpadResult,
} from '../services/fetchMeLaunchpad'
import { fetchOption } from '../services/fetchOption'
import { AutoSizeGrid } from './AutoSizeGrid'
import { MediaCard } from './MediaCard'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../constants'

export const MeLaunchpadGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<fetchMeLaunchpadResult>>(
      'MeLaunchpad',
      fetchMeLaunchpad,
      fetchOption<PagingResult<fetchMeLaunchpadResult>>()
    )
  // const [scrollY, scrollHeight, viewportHeight] = useScrollPosition()

  // const shouldLoadNext = useMemo(
  //   () => scrollY + viewportHeight * 2 >= scrollHeight,
  //   [scrollY, viewportHeight, scrollHeight]
  // )
  // useEffect(() => {
  //   if (hasNextPage && shouldLoadNext) {
  //     fetchNextPage()
  //   }
  // }, [hasNextPage, shouldLoadNext, fetchNextPage])
  const itemData = useMemo(() => data?.pages?.map((d) => d.data).flat(), [data])
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
    ({ data, style }) => (
      <a
        href={`https://magiceden.io/launchpad/` + data.id}
        target='_blank'
        rel='noreferrer'
        style={style}
        title={data.alt}
      >
        <MediaCard
          src={data.src!}
          alt={data.alt}
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE}
        ></MediaCard>
        <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
          {data.alt}
        </div>
        <div className='flex overflow-hidden justify-between text-xs text-ellipsis whitespace-nowrap'>
          <b>{data.date?.substring(0, 10)}</b>
          <b>{data.featured && `⭐ `}</b>
        </div>
      </a>
    ),
    []
  )
  return (
    <div className='grow min-h-screen'>
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
