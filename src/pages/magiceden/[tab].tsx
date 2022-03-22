import { SearchBox } from '../../components/SearchBox'
import { GlobalHead } from '../../components/GlobalHead'
import type { NextPage } from 'next'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { MeCollectionGrid } from '../../components/MeCollectionGrid'
import { queryClient } from '../../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../../components/NavMenu'
import { useRouter } from 'next/router'
import { SolWalletProvider } from '../../components/SolWalletProvider'
import { SolanaStatsBar } from '../../components/SolanaStatsBar'
import { MeLaunchpadGrid } from '../../components/MeLaunchpadGrid'
import { TabPanel } from '../../components/TabPanel'

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
          <div className='flex flex-col flex-nowrap min-h-screen'>
            <SolanaStatsBar />
            <NavMenu />
            <div className='flex flex-col-reverse md:flex-row md:justify-between'>
              <h1 className='m-4 text-3xl dark:text-white md:w-auto'>
                <a
                  href='https://www.magiceden.io'
                  target='_blank'
                  rel='noreferrer'
                  className='underline'
                >
                  MagicEden.io
                </a>{' '}
                {/launchpad/i.test(`${tab}`) && <>Launchpad</>}
                {/collection/i.test(`${tab}`) && <>Collections</>}
              </h1>
              <SearchBox />
            </div>
            <TabPanel>
              {{
                url: '/magiceden/launchpad',
                isActive: /^launchpad$/i.test(`${tab}`),
                title: () => <>Launchpad</>,
                content: () => <MeLaunchpadGrid />,
              }}
              {{
                url: '/magiceden/collection',
                isActive: /^collection$/i.test(`${tab}`),
                title: () => <>Collection</>,
                content: () => <MeCollectionGrid />,
              }}
            </TabPanel>
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default MagicEden
