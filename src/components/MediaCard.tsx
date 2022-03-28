import { CSSProperties, ReactNode, useCallback, useState } from 'react'
import Image from 'next/image'
import { mediaUrlLoader } from '../services/mediaUrlLoader'

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
  const onLoadingComplete = useCallback(() => setLoaded(1), [])
  const onError = useCallback(() => setLoaded(-1), [])
  const url = mediaUrlLoader(src, width, height)
  return (
    <div className='flex' style={style}>
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
