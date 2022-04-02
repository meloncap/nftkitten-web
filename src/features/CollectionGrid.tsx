import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PagingResult } from '../types'
import { LoadingScreen } from '../components/LoadingScreen'
import { MediaCard } from '../components/MediaCard'
import { MediaType } from '../components/MediaType'
import {
  CollectionByVolApiOutput,
  collectionByVolApi,
} from '../services/solscanApi'
import { InfiniteGrid } from '../components/InfiniteGrid'
import Image from 'next/image'
import classNames from 'classnames'
import { MultiRangeSlider } from './multiRangeSlider/MultiRangeSilder'
import { COLLECTION_THUMB_SIZE } from '../contants'

export const CollectionGrid: FC = () => {
  const [filterType, setFilterType] = useState('30day')
  const { isLoading, isError, data } = useQuery<
    PagingResult<CollectionByVolApiOutput>
  >(`SolscanCollectionByVol${filterType}`, collectionByVolApi(filterType), {
    refetchInterval: 1000 * 20,
  })
  const [sliderValues, setSliderValues] = useState<ReadonlyArray<number>>([
    0, 0,
  ])
  const sliderData = useMemo(
    () => data?.data.map((d) => d.sol ?? 0) ?? [],
    [data]
  )
  const xDomain = useMemo(
    () =>
      sliderData.reduce(
        (r, d) => [Math.min(r[0], d), Math.max(r[1], d)],
        [Infinity, -Infinity]
      ),
    [sliderData]
  )
  useEffect(() => setSliderValues(xDomain), [xDomain])
  const itemData = useMemo(
    () =>
      data?.data.filter(
        (d) => d.sol >= sliderValues[0] && d.sol <= sliderValues[1]
      ) ?? [],
    [data, sliderValues]
  )
  const gridCallback = useCallback(
    ({ data, style }) =>
      !data?.src ? null : (
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
            width={COLLECTION_THUMB_SIZE}
            height={COLLECTION_THUMB_SIZE}
          />
          <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
            <MediaType src={data.src} /> {data.alt}
          </div>
          <div className='overflow-hidden text-xs text-ellipsis whitespace-nowrap'>
            <Image alt={data.alt} src='/img/sol.svg' width={12} height={12} />{' '}
            {data.solFormatted}
          </div>
        </a>
      ),
    []
  )
  return (
    <div className='min-h-screen'>
      <div className='flex justify-end py-2 px-4'>
        <a
          href='#'
          aria-current='page'
          className={classNames(
            'py-2 px-4 text-xs sm:text-sm font-medium bg-transparent rounded-l-lg border border-gray-900 hover:bg-gray-900 dark:border-white dark:hover:bg-gray-700',
            {
              'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
                filterType === '30day',
              'focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 text-gray-900 focus:text-white hover:text-white dark:text-white dark:hover:text-white dark:focus:bg-gray-700':
                filterType !== '30day',
            }
          )}
          onClick={useCallback(
            () => filterType !== '30day' && setFilterType('30day'),
            [filterType, setFilterType]
          )}
        >
          30d VOL
        </a>
        <a
          href='#'
          className={classNames(
            'py-2 px-4 text-xs sm:text-sm font-medium bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 dark:border-white dark:hover:bg-gray-700',
            {
              'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
                filterType === '7day',
              'focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 text-gray-900 focus:text-white hover:text-white dark:text-white dark:hover:text-white dark:focus:bg-gray-700':
                filterType !== '7day',
            }
          )}
          onClick={useCallback(
            () => filterType !== '7day' && setFilterType('7day'),
            [filterType, setFilterType]
          )}
        >
          7d VOL
        </a>
        <a
          href='#'
          className={classNames(
            'py-2 px-4 text-xs sm:text-sm font-medium bg-transparent rounded-r-md border border-gray-900 hover:bg-gray-900 dark:border-white dark:hover:bg-gray-700',
            {
              'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800':
                filterType === '',
              'focus:z-10 focus:ring-2 focus:ring-gray-500 text-gray-900 focus:bg-gray-900 focus:text-white hover:text-white dark:text-white dark:hover:text-white dark:focus:bg-gray-700':
                filterType !== '',
            }
          )}
          onClick={useCallback(
            () => filterType !== '' && setFilterType(''),
            [filterType, setFilterType]
          )}
        >
          24h VOL
        </a>
      </div>
      <MultiRangeSlider
        xDomain={xDomain}
        values={sliderValues}
        onValuesChange={useCallback(
          (values) => setSliderValues(values),
          [setSliderValues]
        )}
        sliderData={sliderData}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <InfiniteGrid
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE + 45}
          itemData={itemData}
          gridCallback={gridCallback}
        />
      )}
    </div>
  )
}
