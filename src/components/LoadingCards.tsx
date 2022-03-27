import { CSSProperties, useMemo } from 'react'

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
  const nums = useMemo(() => {
    const nums: number[] = []

    for (let i = 0; i < limit; i++) nums.push(i)

    return nums
  }, [limit])
  return (
    <>
      {nums.map((_, i) => (
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
