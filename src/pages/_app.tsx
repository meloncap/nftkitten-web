import type { AppProps } from 'next/app'
import Script from 'next/script'
import { FC } from 'react'
import useMyStore from '../hooks/useMyStore'
import '../styles/globals.css'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ``
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ``
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ``
const solscanApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_API_BASE_URL ?? ``
const solscanPublicApiBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_PUBLIC_API_BASE_URL ?? ``

export const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useMyStore.setState({
    apiBaseUrl,
    meApiBasUrl,
    imageBaseUrl,
    solscanApiBaseUrl,
    solscanPublicApiBaseUrl,
  })
  return (
    <>
      <Script src='/noflash.js' strategy='beforeInteractive' />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
