import { url as isIPFSurl } from 'is-ipfs'
import Image from 'next/image'

export function MediaType({ src }: { src: string }) {
  if (/^[^/]*\/\/(?:[^/]+.|)arweave\.net\//.test(src)) {
    return (
      <Image
        alt='arweave'
        src='/img/arweave.webp'
        title={src}
        width={12}
        height={12}
      />
    )
  } else if (isIPFSurl(src)) {
    return (
      <Image
        alt='IPFS'
        src='/img/ipfs.webp'
        title={src}
        width={12}
        height={12}
      />
    )
  }
  return (
    <Image alt='404' src='/img/404.webp' title={src} width={12} height={12} />
  )
}
