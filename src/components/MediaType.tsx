import { url as isIPFSurl } from 'is-ipfs'
import Image from 'next/image'

export function MediaType({ src }: { src: string }) {
  if (!src) {
    return null
  }
  if (/^[^/]*\/\/(?:[^/]+.|)arweave\.net\//.test(src)) {
    return (
      <Image
        className='inline'
        alt='arweave'
        src='/img/arweave.webp'
        title={src}
        width={18}
        height={18}
      />
    )
  } else if (isIPFSurl(src)) {
    return (
      <Image
        className='inline'
        alt='IPFS'
        src='/img/ipfs.webp'
        title={src}
        width={18}
        height={18}
      />
    )
  }
  return (
    <Image
      className='inline'
      alt='404'
      src='/img/404.webp'
      title={src}
      width={18}
      height={18}
    />
  )
}
