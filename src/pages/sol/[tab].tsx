import type { NextPage } from 'next'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecentTradePanel } from '../../components/RecentTradePanel'
import { queryClient } from '../../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../../components/NavMenu'
import { SolanaStatsBar } from '../../components/SolanaStatsBar'
// import '@solana/wallet-adapter-react-ui/styles.css'
import { SolWalletProvider } from '../../components/SolWalletProvider'
import { GlobalHead } from '../../components/GlobalHead'
import { SearchBox } from '../../components/SearchBox'
import { TabPanel } from '../../components/TabPanel'

const Home: NextPage = () => {
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
                Recent NFT Trades
              </h1>
              <SearchBox />
            </div>
            <TabPanel>
              {{
                url: '/',
                isActive: false,
                title: () => <>Home</>,
                content: () => null,
              }}
              {{
                url: '/sol/recenttrade',
                isActive: true,
                title: () => <>Recent Trades</>,
                content: () => <RecentTradePanel />,
              }}
            </TabPanel>
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default Home
