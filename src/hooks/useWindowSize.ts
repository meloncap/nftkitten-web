import { useState } from 'react'

// See: https://usehooks-ts.com/react-hook/use-event-listener
import { useEventListener } from 'usehooks-ts'
// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
import { useIsomorphicLayoutEffect } from 'usehooks-ts'

type WindowSize = {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEventListener('resize', handleSize)
  useEventListener('orientationchange', handleSize)

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return windowSize
}
