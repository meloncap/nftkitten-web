/* eslint-disable jsx-a11y/alt-text */
import { FC, useEffect, useMemo, useState } from 'react'
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from 'react-query'
import useStore from '../hooks/useStore'
import type { MECollection, MEErrors } from '../global'
import LoadingScreen from './LoadingScreen'
import Image from 'next/image'
import useScrollPosition from '../hooks/useScrollPosition'

type MECollectionPayload = {
  data: {
    meCollections: MECollection[]
  }
}
type MECollectionsResult = {
  pageParam: number
  data: MECollection[]
}
const SIZE = 100
const LIMIT = 500
type RenderingCollection = {
  symbols: { [symbol: string]: number }
  collections: MECollection[]
}

const fetchOption = (): UseInfiniteQueryOptions<MECollectionsResult> => {
  return {
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length > 0) {
        return lastPage.pageParam + 1
      }
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.pageParam > 0) {
        return lastPage.pageParam + 1
      }
    },
    retry: 10,
  }
}

const LoadingCards: FC = () => {
  return (
    <>
      {new Array(LIMIT).map((_, i) => (
        <div className='flex' key={i}>
          <Image
            src={`/loading.webp`}
            alt='Loading...'
            width={SIZE}
            height={SIZE}
          />
        </div>
      ))}
    </>
  )
}

export const CollectionPanel: FC = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<MECollectionsResult>(
      'collection',
      fetchCollections,
      fetchOption()
    )
  const [scrollY, scrollHeight, viewportHeight] = useScrollPosition()
  const shouldLoadNext = useMemo(() => scrollY + viewportHeight * 2 >= scrollHeight, [scrollY, viewportHeight, scrollHeight])
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
          {hasNextPage && <LoadingCards />}
        </>
      )}
    </div>
  )
}

const Card: FC<{ collection: MECollection }> = ({ collection }) => {
  const imageBaseUrl = useStore.getState().imageBaseUrl
  const [loaded, setLoaded] = useState(false)
  return (
    <div className='flex'>
      {!loaded && (
        <Image
          src='/loading.webp'
          alt='Loading...'
          width={SIZE}
          height={SIZE}
          className='absolute'
        />
      )}
      <Image
        src={`${imageBaseUrl}/${collection.image}?tx=w_${SIZE},h_${SIZE}`}
        alt={collection.name ?? ``}
        width={SIZE}
        height={SIZE}
        unoptimized
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  )
}

const fetchCollections = async ({
  pageParam = 0,
}): Promise<MECollectionsResult> => {
  const apiBaseUrl = useStore.getState().apiBaseUrl
  const res = await fetch(`${apiBaseUrl}/graphql`, {
    method: 'POST',
    body: JSON.stringify({
      query: `
query MyQuery {
  meCollections(offset: ${pageParam * LIMIT}, limit: ${LIMIT}) {
    symbol
    categories
    description
    discord
    image
    name
    twitter
    website
  }
}
`,
    }),
  })
  if (res.ok) {
    const result = await res.json()
    if (result.errors) {
      throw (result as MEErrors).errors[0].message
    }
    return {
      pageParam,
      data: (result as MECollectionPayload).data.meCollections,
    }
  }
  throw `${res.status} ${res.statusText}`
}
