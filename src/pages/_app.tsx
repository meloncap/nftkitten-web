import type { AppProps } from 'next/app'
import Script from 'next/script'
import { StrictMode } from 'react'
import { useMyStore } from '../hooks/useMyStore'
import '../styles/globals.css'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '../services/queryClient'
import { MoralisProvider } from 'react-moralis'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ''
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ''
const moralisBaseUrl: string = process.env.NEXT_PUBLIC_MORALIS_BASE_URL ?? ''
const moralisApplicationId: string =
  process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID ?? ''
const solscanApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_API_BASE_URL ?? ''
const solscanPublicApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_PUBLIC_API_BASE_URL ?? ''

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
      <Script src='/noflash.js' strategy='beforeInteractive' />
      <MoralisProvider
        serverUrl={`${moralisBaseUrl}/server`}
        appId={moralisApplicationId}
      >
        <QueryClientProvider client={queryClient}>
          {/* Dev tools */}
          <ReactQueryDevtools initialIsOpen={false} />
          <Component {...pageProps} />
        </QueryClientProvider>
      </MoralisProvider>
    </StrictMode>
  )
}

export default MyApp
