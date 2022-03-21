import type { NextPage } from 'next'
import styles from '../styles/index.module.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecentTradePanel } from '../components/RecentTradePanel'
import { queryClient } from '../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../components/NavMenu'
import { SolanaStatsBar } from '../components/SolanaStatsBar'

// import '@solana/wallet-adapter-react-ui/styles.css'
import { SolWalletProvider } from '../components/SolWalletProvider'
import { GlobalHead } from '../components/GlobalHead'

const Home: NextPage = () => {
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
            <h1>Recent NFT Trades</h1>
            <RecentTradePanel />
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default Home
