import { useEffect, useState } from 'react'

const useScrollPosition = (): [number, number, number, number] => {
  const [scrollY, setScrollY] = useState(0)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [delta, setDelta] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', updatePosition)
    updatePosition()
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])
  useEffect(() => {
    if (lastScrollY != scrollY) {
      setDelta(lastScrollY - scrollY)
      setLastScrollY(scrollY)
    }
  }, [scrollY, lastScrollY, setDelta])

  if (typeof document !== 'undefined' && document.documentElement) {
    return [
      scrollY,
      document.documentElement.scrollHeight,
      document.documentElement.clientHeight,
      delta,
    ]
  }
  return [scrollY, 0, 0, delta]
}

export default useScrollPosition
