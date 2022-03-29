import { useMyStore } from '../hooks/useMyStore'

export function mediaUrlLoader(src: string, width: number, height: number) {
  const imageBaseUrl = useMyStore.getState().imageBaseUrl
  if (/^ipfs:\/\//.test(src)) {
    src = 'https://ipfs.io/ipfs/' + src.replace(/^ipfs:\/\//, '')
  }
  const f = /\.svg($|\?)/i.test(src) ? 'f_auto' : 'f_webp'
  const q = width <= 100 && height <= 100 ? 'q_auto:low' : 'q_auto'
  let url = [
    imageBaseUrl,
    '/image/',
    f,
    ',',
    q,
    ',w_',
    width,
    ',h_',
    height,
    '/',
    src,
  ].join('')
  return url
}
