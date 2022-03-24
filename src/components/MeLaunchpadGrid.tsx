import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { MELaunchpad, PagingResult, RenderingRows } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { fetchMeLaunchpad } from '../services/fetchMeLaunchpad'
import { fetchOption } from '../services/fetchOption'
import { AutoSizeGrid } from './AutoSizeGrid'
import { MediaCard } from './MediaCard'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../constants'

export const MeLaunchpadGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<MELaunchpad>>(
      'MeCollection',
      fetchMeLaunchpad,
      fetchOption<PagingResult<MELaunchpad>>()
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
      data?.pages
        .reduce(
          (
            r: RenderingRows<{
              id: string
              src: string
              alt: string | undefined
              date: string
              featured: boolean
            }>,
            results: PagingResult<MELaunchpad>
          ) => {
            for (const row of results.data) {
              if (!row.image) continue
              if (row.symbol in r) {
                r.ids[row.symbol]++
              } else {
                r.ids[row.symbol] = 1
                r.rows.push({
                  id: row.symbol,
                  src: row.image,
                  alt: row.name ?? undefined,
                  date: row.launchDatetime ?? ``,
                  featured: !!row.featured,
                })
              }
            }
            return r
          },
          { ids: {}, rows: [] }
        )
        .rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
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
              href={`https://magiceden.io/launchpad/` + data.id}
              target='_blank'
              rel='noreferrer'
              style={style}
            >
              <MediaCard
                src={data.src!}
                alt={data.alt}
                width={COLLECTION_THUMB_SIZE}
                height={COLLECTION_THUMB_SIZE}
              ></MediaCard>
              <div className='flex overflow-hidden justify-between text-xs text-ellipsis whitespace-nowrap'>
                <b>{data.date?.substring(0, 10)}</b>
                <b>{data.featured && `⭐ `}</b>
              </div>
              <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
                {data.alt}
              </div>
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
