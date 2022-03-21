/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react'
import { useQuery } from 'react-query'
import { SolscanTradeResult } from '../global'
import LoadingScreen from './LoadingScreen'
import fetchSolTrade from '../services/fetchSolTrade';
import { Card } from './Card';

export const RecentTradePanel: FC = () => {
  const { isLoading, isError, data } =
    useQuery<SolscanTradeResult>(
      'SolscanTrade',
      fetchSolTrade,
      {
        refetchInterval: 1000
      },
    )
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
          {data?.data.map((data) => (
            data?.info?.meta?.image && 
              <Card key={data.info._id} src={data?.info?.meta?.image ?? ``} alt={data?.info?.meta?.name} size={100} />
          ))}
        </>
      )}
    </div>
  )
}
