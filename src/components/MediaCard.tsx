import { CSSProperties, ReactNode, useCallback, useState } from 'react'
import { useMyStore, MyStoreState } from '../hooks/useMyStore'
import Image from 'next/image'

const imageBaseUrlSelector = (x: MyStoreState) => x.imageBaseUrl

export const MediaCard = ({
  src,
  alt,
  width,
  height,
  style,
  children,
}: {
  src: string
  alt: string | undefined
  width: number
  height: number
  style?: CSSProperties
  children?: ReactNode | ReactNode[]
}) => {
  const [loaded, setLoaded] = useState(0)
  const imageBaseUrl = useMyStore(imageBaseUrlSelector)
  // const [ref, inView] = useInView({
  //   rootMargin: '2000px',
  //   fallbackInView: true,
  //   delay: 300,
  // })
  // useEffect(() => {
  //   if (!inView && loaded) setLoaded(false)
  // }, [loaded, inView, setLoaded])
  const onLoadingComplete = useCallback(() => setLoaded(1), [])
  const onError = useCallback(() => setLoaded(-1), [])
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
      className='flex'
      style={style}
      // ref={ref}
    >
      <Image
        className='hover:z-10 hover:shadow-inner hover:scale-110'
        layout='raw'
        src={loaded < 0 ? src : url}
        alt={alt ?? ``}
        title={alt ?? ``}
        width={width}
        height={height}
        style={{
          backgroundImage: loaded === 0 ? 'url(/img/loading.webp)' : 'none',
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${width}px ${height}px`,
        }}
        onLoadingComplete={onLoadingComplete}
        onError={onError}
        unoptimized={loaded < 0}
      />
      {children}
    </div>
  )
}
