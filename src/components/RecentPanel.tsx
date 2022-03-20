/* eslint-disable jsx-a11y/alt-text */
import { LoadingCards } from './LoadingCards';
import { FC, useEffect, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { MECollectionsResult, RenderingCollection } from '../global'
import LoadingScreen from './LoadingScreen'
import useScrollPosition from '../hooks/useScrollPosition'
import { Card } from './Card';
import fetchCollections from '../services/fetchCollections';
import { fetchOption } from '../services/fetchOption';

export const RecentPanel: FC = () => {
  const { isLoading, isError, isFetching, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<MECollectionsResult>(
      'collection',
      fetchCollections,
      fetchOption()
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
    <div className='flex flex-row flex-wrap content-start justify-start'>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <>
          {data?.pages
            .reduce<RenderingCollection>(
              (r: RenderingCollection, results: MECollectionsResult) => {
                for (const collection of results.data) {
                  if (collection.symbol in r) {
                    r.symbols[collection.symbol]++
                  } else {
                    r.symbols[collection.symbol] = 1
                    r.collections.push(collection)
                  }
                }
                return r
              },
              { symbols: {}, collections: [] }
            )
            .collections.map((collection) => (
              <Card key={collection.symbol} collection={collection} />
            ))}
          {hasNextPage && isFetching && <LoadingCards />}
        </>
      )}
    </div>
  )
}
