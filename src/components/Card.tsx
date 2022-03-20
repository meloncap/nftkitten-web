import { CSSProperties, FC, useRef, useState } from 'react'
import useMyStore from '../hooks/useMyStore'
import { MECollection } from '../global'
import { THUMB_SIZE } from '../constants'
import Image from 'next/image'
import useScrollPosition from '../hooks/useScrollPosition'

export const Card: FC<{ collection: MECollection }> = ({ collection }) => {
  const [loaded, setLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const ref = useRef<any>()
  // eslint-disable-next-line no-unused-vars
  const [scrollY, _, clientHeight] = useScrollPosition()
  if (!collection.image) return null
  const imageBaseUrl = useMyStore.getState().imageBaseUrl
  const loadingBg: CSSProperties = loaded
    ? {
        width: `${THUMB_SIZE}px`,
        height: `${THUMB_SIZE}px`,
        backgroundColor: '#fff',
      }
    : {
        width: `${THUMB_SIZE}px`,
        height: `${THUMB_SIZE}px`,
        backgroundImage: `url(/loading.webp)`,
        backgroundSize: `${THUMB_SIZE}px ${THUMB_SIZE}px`,
      }
  const inView = !ref.current
    ? true
    : ref.current.offsetTop > scrollY - clientHeight * 2 &&
      ref.current.offsetTop < scrollY + clientHeight * 3
  let url = collection.image
  if (!/^https:\/\/pbs\.twimg\.com\//.test(url)) {
    if (url?.indexOf('?') < 0) {
      url = `${imageBaseUrl}/${url}?tx=w_${THUMB_SIZE},h_${THUMB_SIZE}`
    } else {
      url = `${imageBaseUrl}/${url}&tx=w_${THUMB_SIZE},h_${THUMB_SIZE}`
    }
  }
  return (
    <div className='flex' style={loadingBg} ref={ref}>
      {!inView ? <></> : isError ? (
        <Image
          src={collection.image!}
          alt={collection.name ?? ``}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
          unoptimized
        />
      ) : (
        <Image
          src={`${url}`}
          alt={collection.name ?? ``}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  )
}
