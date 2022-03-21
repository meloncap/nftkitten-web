/* eslint-disable jsx-a11y/alt-text */
import { LoadingCards } from './LoadingCards'
import { FC, useEffect, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { MECollection, MECollectionsResult, RenderingRows } from '../global'
import LoadingScreen from './LoadingScreen'
import useScrollPosition from '../hooks/useScrollPosition'
import { MediaCard } from './MediaCard'
import fetchCollections from '../services/fetchCollections'
import { fetchOption } from '../services/fetchOption'
import { COLLECTION_THUMB_SIZE } from '../constants'

export const MeCollectionPanel: FC = () => {
  const {
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    data,
    hasNextPage,
  } = useInfiniteQuery<MECollectionsResult>(
    'MeCollection',
    fetchCollections,
    fetchOption<MECollectionsResult>()
  )

  const [scrollY, scrollHeight, viewportHeight] = useScrollPosition()

  const shouldLoadNext = useMemo(
    () => scrollY + viewportHeight * 2 >= scrollHeight,
    [scrollY, viewportHeight, scrollHeight]
  )
  useEffect(() => {
    if (hasNextPage && shouldLoadNext) {
      fetchNextPage()
    }
  }, [hasNextPage, shouldLoadNext, fetchNextPage])

  return (
    <div className='flex flex-row flex-wrap justify-start content-start'>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <>
          {data?.pages
            .reduce(
              (
                r: RenderingRows<MECollection>,
                results: MECollectionsResult
              ) => {
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
            )
            .rows.map((collection) => (
              <MediaCard
                key={collection.symbol}
                src={collection.image ?? ``}
                alt={collection.name}
                width={COLLECTION_THUMB_SIZE}
                height={COLLECTION_THUMB_SIZE}
              />
            ))}
          {hasNextPage && isFetchingNextPage && (
            <LoadingCards size={COLLECTION_THUMB_SIZE} />
          )}
        </>
      )}
    </div>
  )
}
