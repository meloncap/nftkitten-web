import { CSSProperties, FC, useMemo } from 'react'
import Image from 'next/image'

export const LoadingCards: FC<{
  width: number
  height: number
  limit?: number | undefined
  style?: CSSProperties | undefined
}> = ({ width, height, limit = 1, style }) => {
  const nums = useMemo(() => {
    const nums: number[] = []

    for (let i = 0; i < limit; i++) nums.push(i)

    return nums
  }, [limit])
  return (
    <>
      {nums.map((_, i) => (
        <div className='flex' key={i} style={style}>
          <Image
            src='/img/loading.webp'
            alt='Loading...'
            width={width}
            height={height}
          />
        </div>
      ))}
    </>
  )
}
