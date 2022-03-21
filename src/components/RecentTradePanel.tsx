/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanTrade } from '../global'
import LoadingScreen from './LoadingScreen'
import fetchSolTrade from '../services/fetchSolTrade'
import { MediaCard } from './MediaCard'

export const RecentTradePanel: FC = () => {
  const { isLoading, isError, data } = useQuery<PagingResult<SolscanTrade>>(
    'SolscanTrade',
    fetchSolTrade,
    {
      refetchInterval: 3000,
    }
  )
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
              data?.info?.meta?.image && (
                <MediaCard
                  key={data.info._id}
                  src={data?.info?.meta?.image ?? ``}
                  alt={data?.info?.meta?.name}
                  width={100}
                  height={100}
                />
              )
          )}
        </>
      )}
    </div>
  )
}
