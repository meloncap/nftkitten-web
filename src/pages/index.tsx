import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import useStore from '../hooks/useStore'
import { CollectionPanel } from '../components/CollectionPanel'
import { queryClient } from '../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../components/NavMenu'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ``
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ``
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ``
const solScanBaseUrl: string = process.env.NEXT_PUBLIC_SOLSCAN_API_BASE_URL ?? ``

import '@solana/wallet-adapter-react-ui/styles.css'
import { SolWalletProvider } from '../components/SolWalletProvider'

const Home: NextPage = () => {
  useStore.setState({ apiBaseUrl, meApiBasUrl, imageBaseUrl, solScanBaseUrl })
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
            <CollectionPanel />
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default Home
