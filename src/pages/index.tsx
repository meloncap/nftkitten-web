import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/index.module.css'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import useStore from '../hooks/useStore'
import { CollectionPanel } from '../components/CollectionPanel'
import { queryClient } from '../services/queryClient'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ``
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ``
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ``

const Home: NextPage = () => {
  useStore.setState({ apiBaseUrl, meApiBasUrl, imageBaseUrl })
  return (
    <React.StrictMode>
      {/* Provider */}
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
          <CollectionPanel />
        </div>
      </QueryClientProvider>
    </React.StrictMode>
  )
}

export default Home
