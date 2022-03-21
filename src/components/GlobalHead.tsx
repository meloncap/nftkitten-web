import Head from 'next/head'
import Script from 'next/script'
import { FC } from 'react'

export const GlobalHead: FC = () => {
  return (
    <>
      <Head>
        <title>
          NFTKitten.io | Analyze, track &amp;amp; discover crypto collectibles
          and non-fungible tokens (NFTs)
        </title>
        <meta
          name='description'
          content='Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Script
        id='head-script'
        strategy='beforeInteractive'
        dangerouslySetInnerHTML={{
          __html: `
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark')
}`,
        }}
      />
    </>
  )
}
