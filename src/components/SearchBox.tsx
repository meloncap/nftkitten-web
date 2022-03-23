/* eslint-disable tailwindcss/no-custom-classname */
import { useDebounce } from './../../useDebounce'
import { useEffect, useState, useRef, useMemo } from 'react'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import { fetchNFTSearch } from '../services/fetchNFTSearch'
import { SolscanSearch } from '../global'
import { CollectionRow } from './CollectionRow'

export function SearchBox() {
  const inputRef = useRef<any>()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<string>('')
  const debouncedFilter = useDebounce(filter, 500) as string
  const { data, isError, isLoading, isFetching } = useQuery<SolscanSearch>(
    ['products', debouncedFilter],
    () => fetchNFTSearch(debouncedFilter),
    { enabled: Boolean(debouncedFilter) }
  )
  useEffect(() => {
    function handler(e: any) {
      if (e.keyCode === 75 && e.metaKey) {
        setOpen(true)
      } else if (e.keyCode == 27) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  useEffect(() => {
    if (open) inputRef.current.focus()
  }, [open])
  const lookup = useMemo((): {
    [family: string]: Array<SolscanSearch['collection'][0]>
  } => {
    if (data?.collection.length) {
      return data?.collection.reduce(
        (
          g: { [family: string]: Array<SolscanSearch['collection'][0]> },
          i: SolscanSearch['collection'][0]
        ) => {
          if (i.family && i.family in g) {
            g[i.family].push(i)
          } else {
            g[i.family ?? ``] = [i]
          }
          return g
        },
        {}
      )
    }
    return {}
  }, [data])
  return (
    <>
      <div
        tabIndex={-1}
        className={classNames(
          { hidden: !open },
          'flex overflow-x-hidden overflow-y-auto fixed inset-x-0 top-0 z-50 w-full h-modal md:inset-0 md:h-full bg-gray-700/50 place-content-center'
        )}
      >
        <div className='relative p-4 w-full max-w-4xl h-full md:h-auto'>
          <div className='relative bg-white dark:bg-gray-700 rounded-lg shadow'>
            <div className='flex justify-between items-center p-1 rounded-t border-b dark:border-gray-600'>
              <h3 className='ml-5 text-xl font-medium text-gray-900 dark:text-white'>
                NFT Search
              </h3>
              <button
                type='button'
                className='inline-flex items-center p-1.5 ml-auto text-sm text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg'
                data-modal-toggle='large-modal'
                onClick={() => setOpen(false)}
              >
                <span className='hidden pl-3 mr-2 ml-auto text-xs font-semibold md:inline'>
                  ESC
                </span>
                <svg
                  className='w-8 h-8 md:w-5 md:h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='p-6 space-y-6'>
              <input
                type='text'
                className='block p-2.5 w-full text-sm text-gray-900 dark:placeholder:text-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg border  border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
                placeholder='Search'
                onChange={(ev) => setFilter(ev.target.value)}
                ref={inputRef}
              />
              {((!!filter && !data) || isLoading || isFetching) && (
                <>loading...</>
              )}
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600'>
              {isError ? (
                <>Opps - something go wrong.</>
              ) : isLoading ? null : !data?.collection?.length ? (
                !!debouncedFilter && (
                  <>cannot find anything for &quot;{debouncedFilter}&quot;</>
                )
              ) : (
                <div className='w-full bg-gray-50 dark:bg-gray-800'>
                  {Object.entries(lookup).map(([family, cols], i) =>
                    family ? (
                      <div
                        className='p-2 mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 dark:border-blue-100 border-blue'
                        key={i}
                      >
                        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {family}
                        </h2>
                        <div className='mt-3 divide-y dark:divide-gray-700 divider-gray-200'>
                          {cols.map((r, i) => (
                            <CollectionRow col={r} key={i} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      cols.map((r) => (
                        <div
                          className='mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg dark:border-gray-700'
                          key={r._id}
                        >
                          <div className='mt-3 divide-y dark:divide-gray-700 divider-gray-200'>
                            <CollectionRow col={r} />
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='grow m-4 md:grow-0 md:w-auto'>
        <div className='relative bg-white dark:bg-slate-900 pointer-events-auto'>
          <button
            type='button'
            className='flex items-center py-1.5 pr-3 pl-2 w-full text-sm leading-6 text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md ring-1 ring-slate-900/10 hover:ring-slate-300 shadow-sm'
            onClick={() => setOpen(true)}
          >
            <svg
              width='24'
              height='24'
              fill='none'
              aria-hidden='true'
              className='flex-none mr-3'
            >
              <path
                d='m19 19-3.5-3.5'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></path>
              <circle
                cx='11'
                cy='11'
                r='6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></circle>
            </svg>
            Quick search...
            <span className='hidden flex-none pl-3 ml-auto text-xs font-semibold md:inline'>
              ⌘K
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
