/* eslint-disable jsx-a11y/alt-text */
import { FC, useMemo } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanToken } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { fetchSolByTradeTime } from '../services/fetchSolByTradeTime'
import { MediaCard } from './MediaCard'
import { AutoSizeGrid } from './AutoSizeGrid'

export const RecentTradePanel: FC = () => {
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
        .map((d) => ({
          id: d.info.mint,
          src: d.info.meta.image,
          alt: d.info.data.name,
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
              href={`https://solscan.io/token/` + data.id}
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
