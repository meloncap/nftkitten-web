import type { NextPage } from 'next'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecentTradePanel } from '../../components/RecentTradePanel'
import { queryClient } from '../../services/queryClient'
import { StrictMode, useMemo } from 'react'
import { NavMenu } from '../../components/NavMenu'
import { SolanaStatsBar } from '../../components/SolanaStatsBar'
import { SolWalletProvider } from '../../components/SolWalletProvider'
import { GlobalHead } from '../../components/GlobalHead'
import { SearchBox } from '../../components/SearchBox'
import { TabPanel } from '../../components/TabPanel'
import { HighVolCollectionPanel } from '../../components/HighVolCollectionPanel'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  const { tab } = router.query
  const tabs = useMemo(
    () => [
      {
        url: '/',
        isActive: /^home$/.test(`${tab}`),
        title: () => <>Popular NFT Collections</>,
        content: () => <HighVolCollectionPanel />,
      },
      {
        url: '/sol/recenttrade',
        isActive: /^recenttrade$/.test(`${tab}`),
        title: () => <>Recent Trades</>,
        content: () => <RecentTradePanel />,
      },
    ],
    [tab]
  )
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
                {tabs
                  .filter((t) => t.isActive)
                  .map(({ title: Title }, i) => (
                    <Title key={i} />
                  ))}
              </h1>
              <SearchBox />
            </div>
            <TabPanel tabs={tabs} />
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default Home
