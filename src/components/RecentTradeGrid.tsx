/* eslint-disable jsx-a11y/alt-text */
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanToken } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { fetchSolByTradeTime } from '../services/fetchSolByTradeTime'
import { MediaCard } from './MediaCard'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'

export function RecentTradeGrid() {
  const { isLoading, isError, data } = useQuery<PagingResult<SolscanToken>>(
    'SolscanTokenByTradeTime',
    fetchSolByTradeTime,
    {
      refetchInterval: 1000 * 20,
    }
  )
  const itemData = useMemo(
    () =>
      data?.data
        .filter((d) => d?.info?.meta?.image)
        .sort((a, b) => (a.trade.price ?? 0) < (b.trade.price ?? 0) ? 1 : (a.trade.price ?? 0) > (b.trade.price ?? 0) ? -1 : 0)
        .map((d) => ({
          id: d.info.mint,
          src: d.info.meta.image,
          alt: d.info.data.name,
          sol: d.trade.price ? new Intl.NumberFormat('en-US', {
            maximumSignificantDigits: 2,
          }).format(d.trade.price / 100000000) : '',
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
        <AutoSizeGrid width={100} height={145} itemData={itemData}>
          {({ data, style }) => (
            <a
              href={`https://solscan.io/token/` + data.id}
              target='_blank'
              rel='noreferrer'
              style={style}
              title={data.alt}
            >
              <MediaCard
                key={data.id}
                src={data.src}
                alt={data.alt}
                width={100}
                height={100}
              />
              <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
                {data.alt}
              </div>
              <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
                <Image
                  alt={data.alt}
                  src='/img/sol.svg'
                  width={12}
                  height={12}
                />{' '}
                {data.sol}
              </div>
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
