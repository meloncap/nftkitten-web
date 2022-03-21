import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecentTradePanel } from '../components/RecentTradePanel'
import { queryClient } from '../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../components/NavMenu'

import '@solana/wallet-adapter-react-ui/styles.css'
import { SolWalletProvider } from '../components/SolWalletProvider'

const Home: NextPage = () => {
  return (
    <StrictMode>
      <SolWalletProvider>
        <QueryClientProvider client={queryClient}>
          {/* Dev tools */}
          <ReactQueryDevtools initialIsOpen={false} />
          <div className={styles.container}>
            <Head>
              <title>
                NFTKitten.io | Analyze, track &amp;amp; discover crypto
                collectibles and non-fungible tokens (NFTs)
              </title>
              <meta
                name='description'
                content='Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)'
              />
              <link rel='icon' href='/favicon.ico' />
            </Head>
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
