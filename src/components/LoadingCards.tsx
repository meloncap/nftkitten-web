import { CSSProperties } from 'react'

export function LoadingCards({
  width,
  height,
  limit = 1,
  style,
}: {
  width: number
  height: number
  limit?: number | undefined
  style?: CSSProperties | undefined
}) {
  return (
    <>
      {new Array(limit).fill(true).map((_, i) => (
        <div
          className='flex'
          key={i}
          style={{
            ...style,
            backgroundImage: 'url(/img/loading.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${width}px ${height}px`,
          }}
        ></div>
      ))}
    </>
  )
}
