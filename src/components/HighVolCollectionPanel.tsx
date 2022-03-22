/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanCollection } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchSolCollectionByVol } from '../services/fetchSolCollectionByVol'

export const HighVolCollectionPanel: FC = () => {
  const { isLoading, isError, data } = useQuery<
    PagingResult<SolscanCollection>
  >('SolscanCollectionByVol', fetchSolCollectionByVol, {
    refetchInterval: 1000 * 20,
  })
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
          {data?.data.map(
            (data) =>
              data?.data?.avatar && (
                <a
                  href={
                    `https://solscan.io/collection/` + data.data.collectionId
                  }
                  target='_blank'
                  rel='noreferrer'
                >
                  <MediaCard
                    key={data?.data.collectionId}
                    src={data?.data.avatar ?? ``}
                    alt={data?.data.collection}
                    width={100}
                    height={100}
                  />
                </a>
              )
          )}
        </>
      )}
    </div>
  )
}
