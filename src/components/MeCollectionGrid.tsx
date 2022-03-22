/* eslint-disable jsx-a11y/alt-text */
import { LoadingCards } from './LoadingCards'
import { FC } from 'react'
import { useInfiniteQuery } from 'react-query'
import { MECollection, PagingResult, RenderingRows } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { FixedSizeGrid } from 'react-window'
import { MediaCard } from './MediaCard'
import { fetchMeCollection } from '../services/fetchMeCollection'
import { fetchOption } from '../services/fetchOption'
import { COLLECTION_THUMB_SIZE, PAGE_LIMIT } from '../constants'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfinityLoader from 'react-window-infinite-loader'

export const MeCollectionGrid: FC = () => {
  const {
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    data,
    hasNextPage,
  } = useInfiniteQuery<PagingResult<MECollection>>(
    'MeCollection',
    fetchMeCollection,
    fetchOption<PagingResult<MECollection>>()
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
  const itemData = data?.pages.reduce(
    (r: RenderingRows<MECollection>, results: PagingResult<MECollection>) => {
      for (const row of results.data) {
        if (!row.image) continue
        if (row.symbol in r) {
          r.ids[row.symbol]++
        } else {
          r.ids[row.symbol] = 1
          r.rows.push(row)
        }
      }
      return r
    },
    { ids: {}, rows: [] }
  ).rows
  function isItemLoaded(index: number) {
    if (!itemData) return false
    return itemData.length > index
  }
  function loadMoreItems(_: number, stopIndex: number) {
    if (!itemData) return
    if (stopIndex > itemData.length && hasNextPage) {
      fetchNextPage()
    }
  }
  return (
    <div className='grow min-h-screen'>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <AutoSizer>
          {({ width, height }) => (
            <>
              <InfinityLoader
                isItemLoaded={isItemLoaded}
                itemCount={itemData?.length ?? 0}
                loadMoreItems={loadMoreItems}
                minimumBatchSize={PAGE_LIMIT}
                threshold={~~(height / COLLECTION_THUMB_SIZE)}
              >
                {({ onItemsRendered, ref }) => (
                  <>
                    <FixedSizeGrid
                      columnCount={~~(width / COLLECTION_THUMB_SIZE)}
                      columnWidth={COLLECTION_THUMB_SIZE}
                      rowCount={Math.ceil(
                        (itemData?.length ?? 0) /
                          ~~(width / COLLECTION_THUMB_SIZE)
                      )}
                      rowHeight={COLLECTION_THUMB_SIZE}
                      onItemsRendered={onItemsRendered as any}
                      ref={ref}
                      width={width}
                      height={height}
                      itemData={itemData ?? []}
                    >
                      {({ columnIndex, rowIndex, data, style }) => {
                        const col =
                          data[
                            ~~(width / COLLECTION_THUMB_SIZE) * rowIndex +
                              columnIndex
                          ]
                        if (!col?.image || !itemData) return null
                        return (
                          <MediaCard
                            src={col.image}
                            alt={col.name}
                            width={COLLECTION_THUMB_SIZE}
                            height={COLLECTION_THUMB_SIZE}
                            style={style}
                          ></MediaCard>
                        )
                      }}
                    </FixedSizeGrid>
                    {hasNextPage && isFetchingNextPage && (
                      <LoadingCards size={COLLECTION_THUMB_SIZE} />
                    )}
                  </>
                )}
              </InfinityLoader>
            </>
          )}
        </AutoSizer>
      )}
    </div>
  )
}
