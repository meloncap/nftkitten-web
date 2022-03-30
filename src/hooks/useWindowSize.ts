import { useCallback, useState, useEffect } from 'react'

type WindowSize = {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = useCallback(() => {
    setWindowSize({
      width: screen.availWidth,
      height: screen.availHeight,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleSize)
    window.addEventListener('orientationchange', handleSize)
    handleSize()
    return () => {
      window.removeEventListener('resize', handleSize)
      window.removeEventListener('orientationchange', handleSize)
    }
  }, [handleSize])

  return windowSize
}
