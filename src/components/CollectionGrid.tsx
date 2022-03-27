/* eslint-disable jsx-a11y/alt-text */
import { FC, useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { PagingResult } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { MediaType } from './MediaType'
import {
  fetchSolCollectionByVolResult,
  fetchSolCollectionByVol,
} from '../services/fetchSolCollectionByVol'
import { AutoSizeGrid } from './AutoSizeGrid'
import Image from 'next/image'
import classNames from 'classnames'
import { RangeSlider } from './RangeSilder'
import { COLLECTION_THUMB_SIZE } from '../constants'

export const CollectionGrid: FC = () => {
  const [filterType, setFilterType] = useState('30day')
  const { isLoading, isError, data } = useQuery<
    PagingResult<fetchSolCollectionByVolResult>
  >(
    `SolscanCollectionByVol${filterType}`,
    fetchSolCollectionByVol(filterType),
    {
      refetchInterval: 1000 * 20,
    }
  )
  const [silderValues, setSilderValues] = useState<ReadonlyArray<number>>([
    0, 100,
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
  const itemData = useMemo(() => {
    const min = xDomain[0] + ((xDomain[1] - xDomain[0]) * silderValues[0]) / 100
    const max = xDomain[0] + ((xDomain[1] - xDomain[0]) * silderValues[1]) / 100
    return data?.data.filter((d) => d.sol >= min && d.sol <= max) ?? []
  }, [data, xDomain, silderValues])
  const gridCallback = useCallback(
    ({ data, style }) =>
      !data ? null : (
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
            <Image
              className='inline'
              layout='raw'
              alt={data.alt}
              src='/img/sol.svg'
              width={12}
              height={12}
            />{' '}
            {data.solFormatted}
          </div>
        </a>
      ),
    []
  )
  return (
    <div className='grow min-h-screen'>
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
      <RangeSlider
        xDomain={xDomain}
        values={silderValues}
        onValuesChange={useCallback(
          (values) => setSilderValues(values),
          [setSilderValues]
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
        <AutoSizeGrid width={100} height={145} itemData={itemData}>
          {gridCallback}
        </AutoSizeGrid>
      )}
    </div>
  )
}
