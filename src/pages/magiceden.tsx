import { GlobalHead } from './../components/GlobalHead';
import type { NextPage } from 'next'
import styles from '../styles/index.module.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { MeCollectionPanel } from '../components/MeCollectionPanel'
import { queryClient } from '../services/queryClient'
import { StrictMode } from 'react'
import { NavMenu } from '../components/NavMenu'

// import '@solana/wallet-adapter-react-ui/styles.css'
import { SolWalletProvider } from '../components/SolWalletProvider'

const MagicEden: NextPage = () => {
  return (
    <StrictMode>
      <SolWalletProvider>
        <QueryClientProvider client={queryClient}>
          {/* Dev tools */}
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalHead/>
          <div className={styles.container}>
            <NavMenu />
            <h1>MagicEden.io all collections</h1>
            <MeCollectionPanel />
          </div>
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default MagicEden
