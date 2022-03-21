import { CSSProperties, FC, Ref, useState } from 'react'
import useMyStore from '../hooks/useMyStore'
import Image from 'next/image'
import { InView } from 'react-intersection-observer'

const CardWithInView: FC<{
  src: string
  alt: string | null
  size: number
  inView: boolean
  ref: Ref<any>
}> = ({ src, alt, size, inView, ref }) => {
  const [loaded, setLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imageBaseUrl = useMyStore.getState().imageBaseUrl
  const loadingBg: CSSProperties =
    loaded && inView
      ? {
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: '#fff',
        }
      : {
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url(/loading.webp)`,
          backgroundSize: `${size}px ${size}px`,
        }
  let url = src
  if (!/^https:\/\/pbs\.twimg\.com\//.test(url)) {
    if (url?.indexOf('?') < 0) {
      url = `${imageBaseUrl}/${url}?tx=w_${size},h_${size}`
    } else {
      url = `${imageBaseUrl}/${url}&tx=w_${size},h_${size}`
    }
  }
  return (
    <div className='flex' style={loadingBg} ref={ref}>
      {inView ? (
        <></>
      ) : isError ? (
        <Image
          src={src!}
          alt={alt ?? ``}
          width={size}
          height={size}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
          unoptimized
        />
      ) : (
        <Image
          src={`${url}`}
          alt={alt ?? ``}
          width={size}
          height={size}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  )
}

export const Card: FC<{ src: string; alt: string | null; size: number }> = ({
  src,
  alt,
  size,
}) => {
  return (
    <InView>
      {({ inView, ref }) => (
        <CardWithInView
          src={src}
          alt={alt}
          inView={inView}
          size={size}
          ref={ref}
        />
      )}
    </InView>
  )
}
