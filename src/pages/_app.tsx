import type { AppProps } from 'next/app'
import type { FC } from 'react'
import useMyStore from '../hooks/useMyStore'
import '../styles/globals.css'

const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? ``
const meApiBasUrl: string = process.env.NEXT_PUBLIC_ME_API_BASE_URL ?? ``
const imageBaseUrl: string = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? ``
const solScanBaseUrl: string =
  process.env.NEXT_PUBLIC_SOLSCAN_API_BASE_URL ?? ``

export const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  useMyStore.setState({ apiBaseUrl, meApiBasUrl, imageBaseUrl, solScanBaseUrl })
  return <Component {...pageProps} />
}

export default MyApp
