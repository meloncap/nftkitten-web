import { SearchBox } from '../../components/SearchBox'
import { GlobalHead } from '../../components/GlobalHead'
import type { NextPage } from 'next'
import styles from '../../styles/index.module.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { MeCollectionGrid } from '../../components/MeCollectionGrid'
import { queryClient } from '../../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../../components/NavMenu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SolWalletProvider } from '../../components/SolWalletProvider'
import { SolanaStatsBar } from '../../components/SolanaStatsBar'
import classNames from 'classnames'
import { MeLaunchpadGrid } from '../../components/MeLaunchpadGrid'

// import '@solana/wallet-adapter-react-ui/styles.css'

const MagicEden: NextPage = () => {
  const router = useRouter()
  const { tab } = router.query
  return (
    <StrictMode>
      <SolWalletProvider>
        <QueryClientProvider client={queryClient}>
          {/* Dev tools */}
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalHead />
          <div className={styles.container}>
            <SolanaStatsBar />
            <NavMenu />
            <div className='flex flex-col-reverse md:flex-row md:justify-between'>
              <h1 className='m-4 text-3xl dark:text-white md:w-auto'>
                <a
                  href='https://www.magiceden.io'
                  target='_blank'
                  rel='noreferrer'
                >
                  MagicEden.io
                </a>{' '}
                {/launchpad/i.test(`${tab}`) && <>all launchpads</>}
                {/collection/i.test(`${tab}`) && <>all collections</>}
              </h1>
              <SearchBox />
            </div>
            <div className='border-b border-gray-200 dark:border-gray-700'>
              <ul className='flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400'>
                <li className='mr-2'>
                  <Link href='/magiceden/launchpad' passHref>
                    <a
                      className={classNames(
                        'group inline-flex p-4 rounded-t-lg border-b-2',
                        {
                          'text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500':
                            /launchpad/i.test(`${tab}`),
                          'hover:text-gray-600 dark:hover:text-gray-300 border-transparent hover:border-gray-300':
                            !/launchpad/i.test(`${tab}`),
                        }
                      )}
                      aria-current='page'
                    >
                      <svg
                        className={classNames('mr-2 w-5 h-5', {
                          'text-blue-600 dark:text-blue-500': /launchpad/i.test(
                            `${tab}`
                          ),
                          'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300':
                            !/launchpad/i.test(`${tab}`),
                        })}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'></path>
                      </svg>
                      Launchpad
                    </a>
                  </Link>
                </li>
                <li className='mr-2'>
                  <Link href='/magiceden/collection' passHref>
                    <a
                      className={classNames(
                        'group inline-flex p-4 rounded-t-lg border-b-2',
                        {
                          'text-blue-600 dark:text-blue-500 border-blue-600 dark:border-blue-500':
                            /collection/i.test(`${tab}`),
                          'hover:text-gray-600 dark:hover:text-gray-300 border-transparent hover:border-gray-300':
                            !/collection/i.test(`${tab}`),
                        }
                      )}
                    >
                      <svg
                        className={classNames('mr-2 w-5 h-5', {
                          'text-blue-600 dark:text-blue-500':
                            /collection/i.test(`${tab}`),
                          'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300':
                            !/collection/i.test(`${tab}`),
                        })}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'></path>
                      </svg>
                      Collection
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            {/launchpad/i.test(`${tab}`) && <MeLaunchpadGrid />}
            {/collection/i.test(`${tab}`) && <MeCollectionGrid />}
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default MagicEden
