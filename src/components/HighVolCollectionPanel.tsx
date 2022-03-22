/* eslint-disable jsx-a11y/alt-text */
import { FC, useMemo } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanCollection } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchSolCollectionByVol } from '../services/fetchSolCollectionByVol'
import { AutoSizeGrid } from './AutoSizeGrid'

export const HighVolCollectionPanel: FC = () => {
  const { isLoading, isError, data } = useQuery<
    PagingResult<SolscanCollection>
  >('SolscanCollectionByVol', fetchSolCollectionByVol, {
    refetchInterval: 1000 * 20,
  })
  const itemData = useMemo(
    () =>
      data?.data
        .filter((d) => d?.data?.avatar)
        .map((d) => ({
          id: d.data.collectionId,
          src: d.data.avatar,
          alt: d.data.collection,
        })),
    [data]
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
          width={100}
          height={100}
          itemData={itemData}
          loadMoreItems={() => {}}
        >
          {({ width, height, data, style }) => (
            <a
              href={`https://solscan.io/collection/` + data.id}
              target='_blank'
              rel='noreferrer'
            >
              <MediaCard
                key={data.id}
                src={data.src}
                alt={data.alt}
                width={width}
                height={height}
                style={style}
              />
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
