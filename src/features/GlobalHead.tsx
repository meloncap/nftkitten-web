import Head from 'next/head'

export function GlobalHead({
  pageTitle = `NFTKitten.io | Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)`,
  pageDescription = `Analyze, track &amp;amp; discover crypto collectibles and non-fungible tokens (NFTs)`,
}: {
  pageTitle?: string
  pageDescription?: string
}) {
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />
      <link rel='icon' href='/favicon.ico' />
    </Head>
  )
}
