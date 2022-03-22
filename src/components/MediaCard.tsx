import { CSSProperties, FC, ReactNode, useState } from 'react'
import { useMyStore } from '../hooks/useMyStore'
import Image from 'next/image'
import classNames from 'classnames'
import styles from '../styles/loading.module.css'

export const MediaCard: FC<{
  src: string
  alt: string | null
  width: number
  height: number
  style?: CSSProperties
  children?: ReactNode | ReactNode[]
}> = ({ src, alt, width, height, style, children }) => {
  const [loaded, setLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imageBaseUrl = useMyStore.getState().imageBaseUrl
  // const [ref, inView] = useInView({
  //   rootMargin: '2000px',
  //   fallbackInView: true,
  //   delay: 300,
  // })
  // useEffect(() => {
  //   if (!inView && loaded) setLoaded(false)
  // }, [loaded, inView, setLoaded])
  const loadingStyle: CSSProperties =
    // loaded && inView
    loaded
      ? {
          ...style,
          width: `${width}px`,
          height: `${height}px`,
        }
      : {
          ...style,
          width: `${width}px`,
          height: `${height}px`,
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
    <div
      className={classNames('flex', {
        // [styles['loading-background']]: !(loaded && inView),
        [styles['loading-background']]: !loaded,
      })}
      style={loadingStyle}
      // ref={ref}
    >
      {/* {!inView ? null : isError ? ( */}
      {isError ? (
        <Image
          src={src!}
          alt={alt ?? ``}
          width={width}
          height={height}
          onLoadingComplete={() => setLoaded(false)}
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
      {children}
    </div>
  )
}
