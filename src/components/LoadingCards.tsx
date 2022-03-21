import { FC, useMemo } from 'react'
import { PAGE_LIMIT } from '../constants'
import Image from 'next/image'

export const LoadingCards: FC<{ size: number }> = ({ size }) => {
  const nums = useMemo(() => {
    const nums: number[] = []

    for (let i = 0; i < PAGE_LIMIT; i++) nums.push(i)

    return nums
  }, [])
  return (
    <>
      {nums.map((_, i) => (
        <div className='flex' key={i}>
          <Image
            src='/loading.webp'
            alt='Loading...'
            width={size}
            height={size}
            unoptimized
          />
        </div>
      ))}
    </>
  )
}
