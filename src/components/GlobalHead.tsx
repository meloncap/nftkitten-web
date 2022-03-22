import Head from 'next/head'
import { FC } from 'react'

export const GlobalHead: FC<{
  pageTitle?: string
  pageDescription?: string
}> = ({
  pageTitle = `NFTKitten.io | Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)`,
  pageDescription = `Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)`,
}) => (
  <Head>
    <title>{pageTitle}</title>
    <meta name='description' content={pageDescription} />
    <link rel='icon' href='/favicon.ico' />
  </Head>
)
