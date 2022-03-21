import { CSSProperties, FC, useState } from 'react'
import useMyStore from '../hooks/useMyStore'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

export const MediaCard: FC<{
  src: string
  alt: string | null
  width: number
  height: number
}> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imageBaseUrl = useMyStore.getState().imageBaseUrl
  const [ref, inView] = useInView({
    rootMargin: '2000px',
    fallbackInView: true,
  })
  const loadingBg: CSSProperties =
    loaded && inView
      ? {
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#fff',
        }
      : {
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url(/loading.webp)`,
          backgroundSize: `${width}px ${height}px`,
        }
  const f = /\.svg($|\?)/i.test(src) ? 'f_auto' : 'f_webp'
  const q = width <= 100 && height <= 100 ? 'q_auto:low' : 'q_auto'
  let url =
    imageBaseUrl +
    '/image/' +
    f +
    ',' +
    q +
    ',w_' +
    width +
    ',h_' +
    height +
    '/' +
    src
  return (
    <div className='flex' style={loadingBg} ref={ref}>
      {!inView ? null : isError ? (
        <Image
          src={src!}
          alt={alt ?? ``}
          width={width}
          height={height}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
          unoptimized
        />
      ) : (
        <Image
          src={`${url}`}
          alt={alt ?? ``}
          width={width}
          height={height}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  )
}
