import Head from 'next/head'
import { FC } from 'react'

export const GlobalHead: FC = () => {
  return (
    <Head>
      <title>
        NFTKitten.io | Analyze, track &amp;amp; discover crypto collectibles and
        non-fungible tokens (NFTs)
      </title>
      <meta
        name='description'
        content='Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)'
      />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}
