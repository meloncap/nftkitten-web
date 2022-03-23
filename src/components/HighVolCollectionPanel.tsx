/* eslint-disable jsx-a11y/alt-text */
import { FC, useMemo } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanCollection } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchSolCollectionByVol } from '../services/fetchSolCollectionByVol'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'

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
          sol: new Intl.NumberFormat('en-US', {
            maximumSignificantDigits: 2,
          }).format(d.floorPrice / 100000000),
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
        <AutoSizeGrid width={100} height={130} itemData={itemData}>
          {({ data, style }) => (
            <a
              href={`https://solscan.io/collection/` + data.id}
              target='_blank'
              rel='noreferrer'
              style={style}
            >
              <MediaCard
                key={data.id}
                src={data.src}
                alt={data.alt}
                width={100}
                height={100}
              />
              <div className='flex overflow-hidden flex-row flex-nowrap items-center text-xs text-ellipsis'>
                <Image
                  alt={data.alt}
                  src='/img/sol.svg'
                  width={12}
                  height={12}
                />{' '}
                {data.sol} {data.alt}
              </div>
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
