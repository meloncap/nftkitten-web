import { FC } from 'react'
import { SolscanSearch } from '../global'
import { MediaCard } from './MediaCard'

export const CollectionRow: FC<{ col: SolscanSearch['collection'][0] }> = ({
  col,
}) => {
  return (
    <a
      href={`https://solscan.io/collection/` + col.collectionId}
      className='flex flex-col justify-start items-center px-5 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg border dark:border-gray-700 shadow-md md:flex-row'
      target='_blank'
      rel='noreferrer'
    >
      {!!col.avatar && (
        <div className='object-cover w-auto h-auto rounded-none'>
          <MediaCard
            src={col.avatar}
            alt={col.collection}
            width={100}
            height={100}
          />
        </div>
      )}
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          {col.collection}
          <p className='flex items-center mt-1 mb-3 text-sm font-normal text-gray-700 dark:text-gray-400'>
            Creators {col.creators?.length ?? 0}
            <br />
            Attributes {col.attributes?.length ?? 0}
          </p>
        </h5>
      </div>
    </a>
  )
}
