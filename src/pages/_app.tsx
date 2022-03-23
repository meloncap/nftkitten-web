import type { AppProps } from 'next/app'
import Script from 'next/script'
import { StrictMode } from 'react'
import { SolWalletProvider } from '../components/SolWalletProvider'
import { useMyStore } from '../hooks/useMyStore'
import '../styles/globals.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '../services/queryClient'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ``
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ``
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ``
const solscanApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_API_BASE_URL ?? ``
const solscanPublicApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_PUBLIC_API_BASE_URL ?? ``

export function MyApp({ Component, pageProps }: AppProps) {
  useMyStore.setState({
    apiBaseUrl,
    meApiBasUrl,
    imageBaseUrl,
    solscanApiBaseUrl,
    solscanPublicApiBaseUrl,
  })
  return (
    <StrictMode>
      <SolWalletProvider>
        <Script src='/noflash.js' strategy='beforeInteractive' />
        <QueryClientProvider client={queryClient}>
          {/* Dev tools */}
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </SolWalletProvider>
    </StrictMode>
  )
}

export default MyApp
