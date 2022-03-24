/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import {
  MECollection,
  MECollectionStats,
  PagingResult,
  RenderingRows,
} from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchMeCollection } from '../services/fetchMeCollection'
import { fetchOption } from '../services/fetchOption'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../constants'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'

export const MeCollectionGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<
      PagingResult<{ data: MECollection; stats: MECollectionStats }>
    >(
      'MeCollection',
      fetchMeCollection,
      fetchOption<
        PagingResult<{ data: MECollection; stats: MECollectionStats }>
      >()
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
  const itemData = useMemo(
    () =>
      data?.pages.reduce(
        (
          r: RenderingRows<{
            id: string
            src: string
            alt: string | undefined
            sol: string
            count: number
          }>,
          results: PagingResult<{
            data: MECollection
            stats: MECollectionStats
          }>
        ) => {
          for (const { data, stats } of results.data) {
            if (!data?.image) continue
            if (data.symbol in r) {
              r.ids[data.symbol]++
            } else {
              r.ids[data.symbol] = 1
              r.rows.push({
                id: data.symbol,
                src: data.image,
                alt: data.name ?? undefined,
                sol: !stats?.floorPrice
                  ? ''
                  : new Intl.NumberFormat('en-US', {
                      maximumSignificantDigits: 2,
                    }).format(stats.floorPrice / 100000000),
                count: stats?.listedCount ?? 0,
              })
            }
          }
          return r
        },
        { ids: {}, rows: [] }
      ).rows,
    [data]
  )
  const loadMoreItems = useCallback(
    // eslint-disable-next-line no-unused-vars
    (startIndex: number, stopIndex: number) => {
      if (hasNextPage) {
        return fetchNextPage().then(() => {})
      }
    },
    [hasNextPage, fetchNextPage]
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
          {({ data, style }) => (
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
                {data.alt}
              </div>
              {!!data.sol && (
                <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
                  <Image
                    alt={data.alt}
                    src='/img/sol.svg'
                    width={12}
                    height={12}
                  />{' '}
                  {data.sol}
                </div>
              )}
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
