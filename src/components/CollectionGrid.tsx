/* eslint-disable jsx-a11y/alt-text */
import { FC, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PagingResult, SolscanCollection } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchSolCollectionByVol } from '../services/fetchSolCollectionByVol'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'
import classNames from 'classnames'

export const CollectionGrid: FC = () => {
  const [filterType, setFilterType] = useState('30day')
  const { isLoading, isError, data } = useQuery<
    PagingResult<SolscanCollection>
  >(
    `SolscanCollectionByVol${filterType}`,
    fetchSolCollectionByVol(filterType),
    {
      refetchInterval: 1000 * 20,
    }
  )
  const itemData = useMemo(
    () =>
      data?.data
        .filter((d) => d?.data?.avatar)
        .sort((a, b) =>
          (a.floorPrice ?? 0) < (b.floorPrice ?? 0)
            ? 1
            : (a.floorPrice ?? 0) > (b.floorPrice ?? 0)
            ? -1
            : 0
        )
        .map((d) => ({
          id: d.data.collectionId,
          src: d.data.avatar,
          alt: d.data.collection,
          sol: d.floorPrice
            ? new Intl.NumberFormat('en-US', {
                maximumSignificantDigits: 2,
              }).format(d.floorPrice / 100000000)
            : '',
        })),
    [data]
  )
  return (
    <div className='grow min-h-screen'>
      <div className='flex justify-end p-4'>
        <a
          href='#'
          aria-current='page'
          className={classNames(
            {
              'bg-blue-400 dark:bg-blue-500': filterType === '30day',
              'dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600':
                filterType !== '30day',
            },
            'focus:z-10 py-2 px-4 text-sm font-medium text-blue-700 focus:text-blue-700 dark:text-white dark:focus:text-white bg-white dark:bg-gray-700 rounded-l-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500'
          )}
          onClick={() => setFilterType('30day')}
        >
          30 days volume
        </a>
        <a
          href='#'
          className={classNames(
            {
              'bg-blue-400 dark:bg-blue-500': filterType === '7day',
              'dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600':
                filterType !== '7day',
            },
            'focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 focus:text-blue-700 dark:text-white dark:focus:text-white bg-white dark:bg-gray-700 dark:border-y border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500'
          )}
          onClick={() => setFilterType('7day')}
        >
          7 days volume
        </a>
        <a
          href='#'
          className={classNames(
            {
              'bg-blue-400 dark:bg-blue-500': filterType === '',
              'dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600':
                filterType !== '',
            },
            'focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 focus:text-blue-700 dark:text-white dark:dark:focus:text-white bg-white dark:bg-gray-700 rounded-r-md border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500'
          )}
          onClick={() => setFilterType('')}
        >
          24 hours volume
        </a>
      </div>
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
              href={`https://solscan.io/collection/` + data.id}
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
